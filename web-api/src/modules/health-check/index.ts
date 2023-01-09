/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { HealthCheckController } from './controllers/health-check.controller';
import { IHealthCheckController } from './controllers/health-check.controller.interface';

export function bindDependencies(container: Container): void {
  container.bind<IHealthCheckController>(IHealthCheckController).to(HealthCheckController);
}

export * from './controllers/health-check.controller.interface';
