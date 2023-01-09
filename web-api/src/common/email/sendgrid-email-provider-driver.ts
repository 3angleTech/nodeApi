/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { MailData } from '@sendgrid/helpers/classes/mail';
import * as sendGrid from '@sendgrid/mail';
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
    const message: MailData & Pick<Email, 'dynamic_template_data'> = {
      to: email.to,
      from: email.from,
      templateId: email.templateId,
      dynamic_template_data: email.dynamic_template_data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await sendGrid.send(message as any);
  }
}
