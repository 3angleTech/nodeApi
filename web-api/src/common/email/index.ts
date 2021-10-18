/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { IConfigurationService } from '../configuration';
import { IEmailProviderDriver } from './email-provider-driver.interface';
import { EmailProvider } from './email-provider.enum';
import { EmailService } from './email.service';
import { IEmailService } from './email.service.interface';
import { MockEmailProviderDriver } from './mock-email-provider-driver';
import { SendGridEmailProviderDriver } from './sendgrid-email-provider-driver';

export function bindDependencies(container: Container): void {
  const configurationService = container.get<IConfigurationService>(IConfigurationService);
  const emailProvider = configurationService.getEmailConfig().provider;
  if (emailProvider === EmailProvider.SendGrid) {
    container.bind<IEmailProviderDriver>(IEmailProviderDriver).to(SendGridEmailProviderDriver).inSingletonScope();
  } else {
    container.bind<IEmailProviderDriver>(IEmailProviderDriver).to(MockEmailProviderDriver).inSingletonScope();
  }

  container.bind<IEmailService>(IEmailService).to(EmailService).inSingletonScope();
}
export * from './email.service.interface';
export * from './email-provider-driver.interface';
