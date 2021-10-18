/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { inject, injectable } from 'inversify';
import { UpdateOptions } from 'sequelize';
import { WhereValue } from 'sequelize/types/lib/model';

import { IConfigurationService, OAuthConfiguration } from '../../../common/configuration';
import { encrypt, verify } from '../../../common/crypto';
import { ActivateAccountParameters, IEmailService } from '../../../common/email';
import { InvalidRequestError } from '../../../common/error';
import { IJsonConverterService } from '../../../common/json-converter';
import { Logger, LogLevel } from '../../../common/logger';
import { isNil } from '../../../common/utils';
import { DatabaseModel, IDatabaseContext, User } from '../../../data';
import { Credentials, IAccountService } from './account.service.interface';
import { IJwtTokenService } from './jwt-token.service.interface';

@injectable()
export class AccountService implements IAccountService {
  // eslint-disable-next-line max-params
  constructor(
    @inject(IDatabaseContext) private readonly dbContext: IDatabaseContext,
    @inject(IJsonConverterService) private readonly jsonConverter: IJsonConverterService,
    @inject(IConfigurationService) private readonly configuration: IConfigurationService,
    @inject(IEmailService) private readonly emailService: IEmailService,
    @inject(IJwtTokenService) private readonly tokenService: IJwtTokenService,
  ) {
  }

  private get oauthConfig(): OAuthConfiguration {
    return this.configuration.getOAuthConfig();
  }

  public async verify(credentials: Credentials): Promise<User> {
    const userObject = await this.dbContext.getModel(DatabaseModel.Users).findOne({
      where: {
        username: credentials.username,
      },
    });
    if (isNil(userObject)) {
      throw new InvalidRequestError({
        message: 'Invalid credentials.',
        name: 'INVALID_CREDENTIALS',
      });
    }
    const user: User = this.jsonConverter.deserialize(userObject, User);
    const valid = verify(credentials.password, user.password);
    if (!valid) {
      throw new InvalidRequestError({
        message: 'Invalid credentials.',
        name: 'INVALID_CREDENTIALS',
      });
    }
    return user;
  }

  public async find(userId: number): Promise<User> {
    const userObject = await this.dbContext.getModel(DatabaseModel.Users).findOne({
      where: {
        id: userId,
      },
    });
    if (isNil(userObject)) {
      throw new InvalidRequestError({
        httpStatusCode: 404,
        message: 'Account not found.',
        name: 'NOT_FOUND',
      });
    }
    return this.jsonConverter.deserialize(userObject, User);
  }

  public async findByField(field: string, value: WhereValue): Promise<User> {
    const userObject = await this.dbContext.getModel(DatabaseModel.Users).findOne({
      where: {
        [field]: value,
      },
    });
    if (isNil(userObject)) {
      return null;
    }
    return this.jsonConverter.deserialize(userObject, User);
  }

  public async activate(token: string): Promise<void> {
    const jwtToken = await this.tokenService.verify(token, this.oauthConfig.accessTokenSecret);
    if (isNil(jwtToken.userId)) {
      throw new Error('Token doesn\'t have the user ID set');
    }
    Logger.getInstance().log(LogLevel.Debug, `Decoded token ${jwtToken.userId}`);
    const userPartial: Partial<User> = {
      active: true,
    };
    const updateOptions: UpdateOptions = {
      where: {
        id: jwtToken.userId,
      },
      returning: true,
    };
    const result = await this.dbContext.getModel(DatabaseModel.Users).update(userPartial, updateOptions);
    const resultIndex = 1;
    const affectedRows: User[] = result[resultIndex];
    if (isNil(affectedRows)) {
      throw new Error(`User not found (ID = ${jwtToken.userId})`);
    }
  }

  public generateActivationToken(user: User): Promise<string> {
    const clientIndex = 0;
    return this.tokenService.generate({
      userId: user.id,
      clientId: this.oauthConfig.clients[clientIndex].id,
      clientSecret: this.oauthConfig.accessTokenSecret,
      expirySeconds: this.oauthConfig.clients[clientIndex].accessTokenExpirySeconds,
      grants: this.oauthConfig.clients[clientIndex].grants,
    });
  }

  public async create(newUserPartial: Partial<User>, createdBy: number): Promise<void> {
    const userExists = await this.userExists(newUserPartial);
    if (userExists) {
      const alreadyExistsMessage = 'An user account with the same username or email already exists';
      Logger.getInstance().log(LogLevel.Error, alreadyExistsMessage);
      throw new Error(alreadyExistsMessage);
    }
    this.prepareUserPartialForCreate(newUserPartial, createdBy);
    const createdUser = await this.dbContext.getModel(DatabaseModel.Users).create(newUserPartial);
    if (isNil(createdUser)) {
      const accountNotCreatedMessage = 'Account not created';
      Logger.getInstance().log(LogLevel.Error, accountNotCreatedMessage);
      throw new Error(accountNotCreatedMessage);
    }
    await this.sendAccountActivationEmail(createdUser);
  }

  public async update(userPartial: Partial<User>, updatedBy: number): Promise<void> {
    this.prepareUserPartialForUpdate(userPartial, updatedBy);

    const updateOptions: UpdateOptions = {
      where: {
        id: userPartial.id,
      },
      returning: true,
    };
    const updatedUser = await this.dbContext.getModel(DatabaseModel.Users).update(userPartial, updateOptions);
    if (isNil(updatedUser)) {
      throw new Error('Failed to updated user');
    }
  }

  private prepareUserPartialForCreate(newUserPartial: Partial<User>, createdBy: number): void {
    const currentDate: Date = new Date();
    newUserPartial.createdAt = currentDate;
    newUserPartial.updatedAt = currentDate;

    newUserPartial.createdBy = createdBy;
    newUserPartial.updatedBy = createdBy;

    newUserPartial.active = false;
    newUserPartial.password = encrypt(newUserPartial.password);
  }

  private prepareUserPartialForUpdate(userPartial: Partial<User>, updatedBy: number): void {
    userPartial.updatedAt = new Date();

    userPartial.updatedBy = updatedBy;

    if (userPartial.password) {
      userPartial.password = encrypt(userPartial.password);
    }
  }

  private async userExists(user: Partial<User>): Promise<boolean> {
    const userWithSameUsername = await this.findByField('username', user.username);
    if (!isNil(userWithSameUsername)) {
      return true;
    }
    const userWithSameEmail = await this.findByField('email', user.email);
    if (!isNil(userWithSameEmail)) {
      return true;
    }
    return false;
  }

  private async sendAccountActivationEmail(user: User): Promise<void> {
    const toAddress: string = user.email;
    const fromAddress: string = this.configuration.getEmailConfig().from;

    const accessToken: string = await this.generateActivationToken(user);
    const encodedAccessToken: string = encodeURIComponent(accessToken);
    const activationLink: string = `${this.configuration.getClientBaseUrl()}/account/activate?token=${encodedAccessToken}`;

    const templateParameters: ActivateAccountParameters = {
      name: user.firstName,
      activationLink: activationLink,
    };
    await this.emailService.sendAccountActivationEmail(toAddress, fromAddress, templateParameters);
  }
}
