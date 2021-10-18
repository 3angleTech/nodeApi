/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { IStringTemplateService, StringTemplateService } from './string-template.service';

export function bindDependencies(container: Container): void {
  container.bind<IStringTemplateService>(IStringTemplateService).to(StringTemplateService);
}

export * from './string-template.service';
