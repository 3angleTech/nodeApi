/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Request } from 'express';

import { AppContext } from './app-context';

export interface AppRequest extends Request {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  getAppContext: () => AppContext;
}
