/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { NextFunction } from 'express';
import { AppRequest, AppResponse } from '../../../core';

/**
 * Performs health control to report about application status.
 */
export interface IHealthCheckController {
  /**
   * Performs operations to report the health of the application.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  run(req: AppRequest, res: AppResponse, next: NextFunction): void;
}
export const IHealthCheckController = Symbol.for('IHealthCheckController');
