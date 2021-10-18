/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { ConfigurationService } from './configuration.service';
import { IConfigurationService } from './configuration.service.interface';

export function bindDependencies(container: Container): void {
  container.bind<IConfigurationService>(IConfigurationService).to(ConfigurationService);
}

export * from './configuration.service.interface';
