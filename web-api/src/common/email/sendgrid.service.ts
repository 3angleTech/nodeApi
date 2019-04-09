/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import * as sendGrid from '@sendgrid/mail';
import { inject, injectable } from 'inversify';
import { IConfigurationService } from '../configuration';
import { Logger, LogLevel } from '../logger';
import { IEmailTemplateService } from './email-template.service.interface';
import { ActivateAccountParams, EmailParams, IEmailService, NewAccountParams } from './email.service.interface';
import { HttpStatus } from './http-status';

@injectable()
export class SendGridService implements IEmailService {

    constructor(
        @inject(IConfigurationService) private configuration: IConfigurationService,
        @inject(IEmailTemplateService) private emailTemplateService: IEmailTemplateService,
    ) {
      this.setApiKey();
    }

    private setApiKey(): void {
        sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    public async sendAccountActivationEmail(params: ActivateAccountParams): Promise<void> {
        let template = this.emailTemplateService.getTemplate('activation');
        const replaceTags = {
            '[JWT_TOKEN]': params.token,
        };
        template = this.emailTemplateService.replaceTemplateTags(template, replaceTags);
        let localParams = { ...params };
        localParams = this.emailTemplateService.setTextParams(localParams, template);
        await this.sendEmail(localParams);
        return Promise.resolve();
    }

    public async sendNewAccountEmail(params: NewAccountParams): Promise<void> {
        // TODO: Pass parameters such as username in e-mail
        await this.sendEmail(params);
        return Promise.resolve();
    }

    public async sendEmail(params: EmailParams): Promise<void> {
        const mailData = {
            to: params.to,
            from: params.from,
            subject: params.subject,
            text: params.text,
            html: params.html,
        };
        const response = await sendGrid.send(mailData);

        const statusCode = response[0].statusCode;
        if (statusCode === HttpStatus.ACCEPTED) {
            return;
        }

        Logger.getInstance().log(LogLevel.Error, `Error sending e-mail to ${params.to}`, {
            sendGridResponse: response[0],
            parameters: params,
        });
        throw new Error(`Error Sending Email to ${params.to}`);
    }
}
