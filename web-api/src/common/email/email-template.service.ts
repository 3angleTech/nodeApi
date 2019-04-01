/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import { inject, injectable } from 'inversify';
import { EmailParams } from '../../data/data-objects/email/email-params.do';
import { EmailTemplate, EmailTemplates, IConfigurationService } from '../configuration';
import { IEmailTemplateService } from './email-template.service.interface';

@injectable()
export class EmailTemplateService implements IEmailTemplateService {

    private static instance: EmailTemplateService;

    constructor(
        @inject(IConfigurationService) private configuration: IConfigurationService,
    ) {
        if (EmailTemplateService.instance) {
            return EmailTemplateService.instance;
        }
        EmailTemplateService.instance = this;
    }

    public getTemplate(key: string): EmailTemplate {
        const emailTemplates: EmailTemplates = this.configuration.getEmailTemplates();
        return emailTemplates[key];
    }

    public replaceTemplateTags(template: EmailTemplate, associations: any): EmailTemplate {
        Object.keys(associations).forEach(key => {
            template.html = template.html.replace(key, associations[key]);
            template.raw = template.raw.replace(key, associations[key]);
        });
        return template;
    }

    public setTextParams<T extends EmailParams>(params: T, template: EmailTemplate): T {
        params.rawText = template.raw;
        params.htmlText = template.html;
        return params;
    }

}