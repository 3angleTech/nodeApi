/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { inject, injectable } from 'inversify';
import { IConfigurationService } from '../configuration';
import { Logger, LogLevel } from '../logger';
import { IEmailProviderDriver } from './email-provider-driver.interface';
import { ActivateAccountParameters, Email, ForgotPasswordParameters, IEmailService, NewAccountParameters } from './email.service.interface';

@injectable()
export class EmailService implements IEmailService {

  constructor(
    @inject(IEmailProviderDriver) private emailDriver: IEmailProviderDriver,
    @inject(IConfigurationService) private configuration: IConfigurationService,
  ) {
  }

  public async sendEmail(email: Email): Promise<void> {
    try {
      await this.emailDriver.sendEmail(email);
    } catch (err) {
      const errorMessage = 'Failed to send email';
      Logger.getInstance().log(LogLevel.Error, errorMessage, err);
      // TODO: Provide a mock service for development and remove this error log entry.
      console.error(errorMessage, email);
      throw err;
    }
  }

  public async sendAccountActivationEmail(to: string, from: string, templateParameters: ActivateAccountParameters): Promise<void> {
    const templateId = this.configuration.getEmailConfig().templateIds.accountActivation;

    const email: Email = {
      to: to,
      from: from,
      templateId: templateId,
      dynamic_template_data: { ...templateParameters },
    };

    await this.sendEmail(email);
  }

  public async sendForgotPasswordEmail(to: string, from: string, templateParameters: ForgotPasswordParameters): Promise<void> {
    const templateId = this.configuration.getEmailConfig().templateIds.forgotPassword;

    const email: Email = {
      to: to,
      from: from,
      templateId: templateId,
      dynamic_template_data: { ...templateParameters },
    };

    await this.sendEmail(email);
  }

  public async sendNewAccountEmail(to: string, from: string, templateParameters: NewAccountParameters): Promise<void> {
    // TODO: Pass parameters such as username in e-mail
    await this.sendEmail(null);
  }
}
