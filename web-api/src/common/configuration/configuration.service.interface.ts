/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Algorithm } from 'jsonwebtoken';

/**
 * Provides OAuth client credentials and token expiration times.
 */
export interface OAuthClient {
  id: string;
  secret: string;
  grants: string[];
  accessTokenExpirySeconds: number;
  refreshTokenExpirySeconds: number;
  activationTokenExpirySeconds: number;
}

/**
 * Provides configuration data for OAuth.
 */
export interface OAuthConfiguration {
  issuer: string;
  algorithm: Algorithm;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  clients: OAuthClient[];
}

/**
 * Provides email provider, configuration data and template ids.
 */
export interface EmailConfiguration {
  provider: string;
  from: string;
  templateIds: EmailTemplateIds;
}

/**
 * Provides ids of email templates.
 */
export interface EmailTemplateIds {
  accountActivation: string;
  forgotPassword: string;
  newAccount: string;
}

/**
 * Provides configuration params for emails.
 */
export interface EmailConfigurationParams {
  from: string;
}

/**
 * Provides OAuth and email configuration data.
 */
export interface IConfigurationService {

  /**
   * Provides the base URL of the Opensource client
   */
  getClientBaseUrl(): string;

  /**
   * Provides configuration data for OAuth.
   */
  getOAuthConfig(): OAuthConfiguration;

  /**
   * Provides email configuration data.
   */
  getEmailConfig(): EmailConfiguration;
}
export const IConfigurationService = Symbol.for('IConfigurationService');
