/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Email } from './email.service.interface';

/**
 * Provides the driver for the e-mail provider.
 */
export interface IEmailProviderDriver {

  /**
   * Sends the email.
   *
   * @param email The target email.
   */
  sendEmail(email: Email): Promise<void>;
}
export const IEmailProviderDriver = Symbol.for('IEmailProviderDriver');
