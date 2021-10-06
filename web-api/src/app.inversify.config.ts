/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';

import { Container } from 'inversify';

import { bindDependencies as bindConfigurationDependencies } from './common/configuration';
import { bindDependencies as bindJsonConvertedDependencies } from './common/json-converter';
import { bindDependencies as bindDataDependencies } from './data';

import { bindDependencies as bindHealthCheckDependencies } from './modules/health-check';
import { bindDependencies as bindSecurityDependencies } from './modules/security';

import { bindDependencies as bindEmailDependencies } from './common/email';
import { bindDependencies as bindStringTemplateDependencies } from './common/string-template';

const appContainer = new Container();

/**
 * Bind application wide dependencies.
 */
bindConfigurationDependencies(appContainer);
bindDataDependencies(appContainer);
bindJsonConvertedDependencies(appContainer);
bindHealthCheckDependencies(appContainer);
bindSecurityDependencies(appContainer);
bindEmailDependencies(appContainer);
bindStringTemplateDependencies(appContainer);

export { appContainer };
