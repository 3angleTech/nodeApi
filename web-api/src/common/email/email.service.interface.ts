/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

/**
 * Provides generic email template parameters.
 */
export interface Email {
  to: string;
  from: string;
  templateId: string;
  // eslint-disable-next-line camelcase
  dynamic_template_data: Record<string, string | number>;
}

/**
 * Provides parameters for account activation emails.
 */
export interface ActivateAccountParameters {
  name: string;
  activationLink: string;
}

export interface ForgotPasswordParameters {
  name: string;
  passwordResetLink: string;
}

/**
 * Provides parameters for new account emails.
 */
export interface NewAccountParameters {
  username: string;
}

/**
 * Provides the email service used for actions like activation, sign up, or password reset.
 */
export interface IEmailService {

  /**
   * Sends a generic email message.
   *
   * @param email The target email.
   */
  sendEmail(email: Email): Promise<void>;

  /**
   * Sends an account activation email.
   *
   * @param to Email recipient.
   * @param from Email sender.
   * @param templateParameters Parameters to be replaced in the template.
   */
  sendAccountActivationEmail(to: string, from: string, templateParameters: ActivateAccountParameters): Promise<void>;

  /**
   * Sends an email containing a password reset link.
   *
   * @param to Email recipient.
   * @param from Email sender.
   * @param templateParameters Parameters to be replaced in the template.
   */
  sendForgotPasswordEmail(to: string, from: string, templateParameters: ForgotPasswordParameters): Promise<void>;

  /**
   * Sends a new account email.
   *
   * @param to Email recipient.
   * @param from Email sender.
   * @param templateParameters Parameters to be replaced in the template.
   */
  sendNewAccountEmail(to: string, from: string, templateParameters: NewAccountParameters): Promise<void>;
}
export const IEmailService = Symbol.for('IEmailService');
