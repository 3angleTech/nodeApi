/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Response } from 'express';

import { User } from '../data';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface UserContext {
  user: User;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface AppResponse extends Response {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  getUserContext: () => UserContext;
}
