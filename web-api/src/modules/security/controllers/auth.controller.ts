/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import { NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { IConfigurationService, OAuthConfiguration } from '../../../common/configuration';
import { ForgotPasswordParameters, IEmailService } from '../../../common/email';
import { InvalidRequestError, UnauthorizedError } from '../../../common/error';
import { isNil } from '../../../common/utils';
import { AppRequest, AppResponse } from '../../../core';
import { DatabaseModel, IDatabaseContext, User } from '../../../data';
import {
  ANONYMOUS_USER_ID,
  IAccountService,
  IForgotPasswordRequest,
  IPasswordChangeRequest,
  IPasswordResetRequest,
} from '../services/account.service.interface';
import { IJwtTokenService } from '../services/jwt-token.service.interface';
import { IOAuthServer } from '../services/oauth-server.interface';

import {
  accessTokenCookieName,
  authenticatedCookieName,
  IAuthController,
  refreshTokenCookieName,
  refreshTokenGrantName,
} from './auth.controller.interface';

@injectable()
export class AuthController implements IAuthController {

  // eslint-disable-next-line max-params
  constructor(
    @inject(IAccountService) private accountService: IAccountService,
    @inject(IConfigurationService) private configuration: IConfigurationService,
    @inject(IDatabaseContext) private dbContext: IDatabaseContext,
    @inject(IEmailService) private emailService: IEmailService,
    @inject(IOAuthServer) private oauthServer: IOAuthServer,
    @inject(IJwtTokenService) private tokenService: IJwtTokenService,
  ) {
    this.token = this.token.bind(this);
    this.getAccount = this.getAccount.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.activateAccount = this.activateAccount.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.logout = this.logout.bind(this);
  }

  private get oauthConfig(): OAuthConfiguration {
    return this.configuration.getOAuthConfig();
  }

  public async activateAccount(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    try {
      await this.accountService.activate(req.query.token);
      res.json({ message: 'Account activated successfully.' });
    } catch (err) {
      return next(err);
    }
  }

  public async token(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    const isRefreshTokenRequest = req.body.grant_type === refreshTokenGrantName;
    // Automatically set the accessToken and refreshToken for clients using HttpOnly cookies.
    if (isRefreshTokenRequest) {
      const accessToken = req.cookies[accessTokenCookieName];
      const refreshToken = req.cookies[refreshTokenCookieName];
      if (isNil(accessToken) || isNil(refreshToken)) {
        return next(new InvalidRequestError({
          message: 'Missing authentication information.',
          name: 'NO_AUTH_CREDENTIALS',
        }));
      }
      // TODO: Reformat the code to avoid updating these values.
      req.body.access_token = accessToken;
      req.body.refresh_token = refreshToken;
    }

    if (!req.body.username && req.body.email) {
      try {
        const loadedUser: User = await this.accountService.findByField('email', req.body.email);
        if (loadedUser) {
          req.body.username = loadedUser.username;
        } else {
          return next(new InvalidRequestError({
            message: 'Invalid credentials.',
            name: 'INVALID_CREDENTIALS',
          }));
        }
      } catch (err) {
        return next(err);
      }
    }

    try {
      const token = await this.oauthServer.token(req, res);
      res.cookie(accessTokenCookieName, token.accessToken, {
        httpOnly: true,
      });
      res.cookie(refreshTokenCookieName, token.refreshToken, {
        httpOnly: true,
      });
      res.cookie(authenticatedCookieName, true, {
        httpOnly: false,
      });

      const message = isRefreshTokenRequest ? 'Token has been refreshed.' : `You are now logged in as ${token.user.username}.`;
      res.json({
        message: message,
      });
    } catch (err) {
      return next(err);
    }
  }

  public async getAccount(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    const userId = res.getUserContext().user.id;

    const user = await this.accountService.find(userId);
    delete user.password;
    res.json(user);
  }

  public async createAccount(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    const userContext = res.getUserContext();
    const createdBy: number = userContext ? userContext.user.id : ANONYMOUS_USER_ID;
    const newUserPartial: Partial<User> = req.body;

    try {
      await this.accountService.create(newUserPartial, createdBy);
      res.json({ message: 'User created successfully.' });
    } catch (err) {
      return next(err);
    }
  }

  public async changePassword(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    const currentUser: User = res.getUserContext().user;
    const passwordChange: IPasswordChangeRequest = req.body;
    try {
      // TODO: Refactor `IAccountService.verify()` to avoid loading the user a 2nd time.
      const verifiedUser = await this.accountService.verify({
        username: currentUser.username,
        password: passwordChange.currentPassword,
      });
      if (isNil(verifiedUser)) {
        return next(new UnauthorizedError({
          httpStatusCode: 403,
          name: 'INVALID_PASSWORD',
          message: 'Invalid password.',
        }));
      }

      const changes: Partial<User> = {
        id: currentUser.id,
        password: passwordChange.newPassword,
      };
      const updatedBy: number = currentUser.id;

      await this.accountService.update(changes, updatedBy);
      res.json({ message: 'Password changed.' });
    } catch (err) {
      return next(err);
    }
  }

  public async forgotPassword(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    let userObject: User = null;
    try {
      const passwordResetReq: IForgotPasswordRequest = req.body;
      userObject = await this.dbContext.getModel(DatabaseModel.Users).findOne({
        where: {
          email: passwordResetReq.email,
        },
      });

      if (isNil(userObject)) {
        // TODO: Refactor message to avoid disclosing user account existence via forgot password requests.
        return next(new InvalidRequestError({
          message: 'Invalid email.',
          name: 'INVALID_EMAIL',
        }));
      }

      await this.sendForgotPasswordEmail(userObject);
      res.json({ message: 'Forgot password email sent.' });
    } catch (err) {
      return next(err);
    }
  }

  public async resetPassword(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    const currentUser: User = res.getUserContext().user;
    const passwordReset: IPasswordResetRequest = req.body;

    const changes: Partial<User> = {
      id: currentUser.id,
      password: passwordReset.newPassword,
    };
    const updatedBy: number = currentUser.id;

    try {
      await this.accountService.update(changes, updatedBy);
      res.json({ message: 'Password changed.' });
    } catch (err) {
      return next(err);
    }
  }

  public logout(req: AppRequest, res: AppResponse, next: NextFunction): void {
    res.clearCookie(accessTokenCookieName);
    res.clearCookie(refreshTokenCookieName);
    res.clearCookie(authenticatedCookieName);
    res.json({
      message: 'Logged out successfully',
    });
  }

  private async generateAccessToken(user: User): Promise<string> {
    return this.tokenService.generate({
      userId: user.id,
      clientId: this.oauthConfig.clients[0].id,
      clientSecret: this.oauthConfig.accessTokenSecret,
      expirySeconds: this.oauthConfig.clients[0].accessTokenExpirySeconds,
      grants: this.oauthConfig.clients[0].grants,
    });
  }

  private async sendForgotPasswordEmail(user: User): Promise<void> {
    const toAddress: string = user.email;
    const fromAddress: string = this.configuration.getEmailConfig().from;

    const accessToken: string = await this.generateAccessToken(user);
    const encodedAccessToken = encodeURIComponent(accessToken);
    const passwordResetLink: string = `${this.configuration.getClientBaseUrl()}/account/reset-password?token=${encodedAccessToken}`;

    const templateParameters: ForgotPasswordParameters = {
      name: user.firstName,
      passwordResetLink: passwordResetLink,
    };

    return this.emailService.sendForgotPasswordEmail(toAddress, fromAddress, templateParameters);
  }
}
