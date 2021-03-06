/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { MailData } from '@sendgrid/helpers/classes/mail';
import * as sendGrid from '@sendgrid/mail';
import * as HttpStatus from 'http-status-codes';
import { injectable } from 'inversify';
import { IEmailProviderDriver } from './email-provider-driver.interface';
import { Email } from './email.service.interface';

@injectable()
export class SendGridEmailProviderDriver implements IEmailProviderDriver {

  constructor(
  ) {
    this.setApiKey();
  }

  private setApiKey(): void {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public async sendEmail(email: Email): Promise<void> {
    const message: MailData & { dynamic_template_data: any } = {
      to: email.to,
      from: email.from,
      templateId: email.templateId,
      dynamic_template_data: email.dynamic_template_data,
    };

    try {
      const response = await sendGrid.send(message as any);
      const statusCode = response[0].statusCode;
      switch (statusCode) {
        case HttpStatus.ACCEPTED:
          return;
      }
    } catch (e) {
      throw e;
    }
  }
}
