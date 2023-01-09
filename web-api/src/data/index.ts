/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { DatabaseContext } from './database-context';
import { IDatabaseContext } from './database-context.interface';

export function bindDependencies(container: Container): void {
  container.bind<IDatabaseContext>(IDatabaseContext).to(DatabaseContext).inSingletonScope();
}

export * from './data-objects/user.do';
export * from './database-context.interface';
