/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { inject, injectable } from 'inversify';
import { find } from 'lodash';
import { Client, RefreshToken, Token } from 'oauth2-server';
import { IConfigurationService, OAuthConfiguration } from '../../../common/configuration';
import { isNil } from '../../../common/utils';
import { OAuthUser } from '../data-objects/oauth-user.do';
import { IAccountService } from './account.service.interface';
import { IJwtTokenService } from './jwt-token.service.interface';
import { IOAuthServerModel } from './oauth-server-model.interface';

@injectable()
export class OAuthServerModel implements IOAuthServerModel {

  constructor(
    @inject(IConfigurationService) private configurationService: IConfigurationService,
    @inject(IAccountService) private accountService: IAccountService,
    @inject(IJwtTokenService) private tokenService: IJwtTokenService,
  ) {
  }

  public generateAccessToken(client: Client, user: OAuthUser, scope: string | string[]): Promise<string> {
    return this.tokenService.generate({
      userId: user.id,
      expirySeconds: client.accessTokenLifetime,
      clientId: client.id,
      // TODO: this is not client secret, it's accessToken secret
      clientSecret: this.oauthConfig.accessTokenSecret,
      grants: <string[]>client.grants,
    });
  }

  public async getAccessToken(accessToken: string): Promise<Token> {
    const decoded = await this.tokenService.verify(accessToken, this.oauthConfig.accessTokenSecret);
    return Promise.resolve({
      accessToken: accessToken,
      accessTokenExpiresAt: new Date(decoded.expiresAt),
      user: {
        id: decoded.userId,
      },
      client: {
        id: decoded.clientId,
        grants: decoded.grants,
      },
    });
  }

  public generateRefreshToken(client: Client, user: OAuthUser, scope: string | string[]): Promise<string> {
    return this.tokenService.generate({
      userId: user.id,
      expirySeconds: client.refreshTokenLifetime,
      clientId: client.id,
      clientSecret: this.oauthConfig.refreshTokenSecret,
      grants: <string[]>client.grants,
    });
  }

  public async getRefreshToken(refreshToken: string): Promise<RefreshToken> {
    const decoded = await this.tokenService.verify(refreshToken, this.oauthConfig.refreshTokenSecret);
    return Promise.resolve({
      refreshToken: refreshToken,
      refreshTokenExpiresAt: new Date(decoded.expiresAt),
      user: {
        id: decoded.userId,
      },
      client: {
        id: decoded.clientId,
        grants: decoded.grants,
      },
    });
  }

  public saveToken(token: Token, client: Client, user: OAuthUser): Promise<Token> {
    token.client = client;
    token.user = user;
    return Promise.resolve(token);
  }

  public getUser(username: string, password: string): Promise<OAuthUser> {
    return this.accountService.verify({
      username: username,
      password: password,
    });
  }

  public getClient(clientId: string, clientSecret: string): Promise<Client> {
    const client = find(this.oauthConfig.clients, c => {
      return c.id === clientId;
    });
    if (isNil(client)) {
      throw new Error(`Client with id ${clientId} not found`);
    }
    if (client.secret !== clientSecret) {
      throw new Error(`Invalid client secret for clientId ${clientId}`);
    }
    return Promise.resolve({
      id: clientId,
      grants: client.grants,
      accessTokenLifetime: client.accessTokenExpirySeconds,
      refreshTokenLifetime: client.refreshTokenExpirySeconds,
    });
  }

  public verifyScope(token: Token, scope: string | string[]): Promise<boolean> {
    return Promise.resolve(true);
  }

  public revokeToken(token: Token | RefreshToken): Promise<boolean> {
    return Promise.resolve(true);
  }

  private get oauthConfig(): OAuthConfiguration {
    return this.configurationService.getOAuthConfig();
  }

}
