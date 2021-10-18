/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { JsonConverterService } from './json-converter.service';
import { IJsonConverterService } from './json-converter.service.interface';

export function bindDependencies(container: Container): void {
  container.bind<IJsonConverterService>(IJsonConverterService).to(JsonConverterService);
}

export * from './iso-date-converter';
export * from './json-converter.service.interface';
