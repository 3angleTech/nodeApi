/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { inject, injectable } from 'inversify';
import { sign as signToken, verify as verifyToken } from 'jsonwebtoken';
import { IConfigurationService, OAuthConfiguration } from '../../../common/configuration';
import { IJwtTokenService, isTokenPayload, TokenGenerateOptions, TokenPayload } from './jwt-token.service.interface';

@injectable()
export class JwtTokenService implements IJwtTokenService {

  constructor(
    @inject(IConfigurationService) private configuration: IConfigurationService,
  ) {
  }

  private get oauthConfig(): OAuthConfiguration {
    return this.configuration.getOAuthConfig();
  }

  public generate(options: TokenGenerateOptions): Promise<string> {
    const expiresAt = new Date(
      // tslint:disable-next-line:no-magic-numbers
      new Date().getTime() + (options.expirySeconds * 1000),
    );
    const payload: TokenPayload = {
      userId: options.userId,
      clientId: options.clientId,
      grants: options.grants,
      issuer: this.oauthConfig.issuer,
      expiresAt: expiresAt,
    };
    const token = signToken(payload, options.clientSecret, {
      algorithm: this.oauthConfig.algorithm,
    });
    return Promise.resolve(token);
  }

  public verify(token: string, clientSecret: string): Promise<TokenPayload> {
    const decoded = verifyToken(token, clientSecret);
    if (!isTokenPayload(decoded)) {
      throw new Error('Invalid token payload.');
    }
    return Promise.resolve(decoded);
  }

}
