/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import { NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';

import { AppRequest, AppResponse } from '../../core';
import { Logger, LogLevel } from '../logger';

import { AppError } from './app-error';
import { getErrorResponse } from './get-error-response';

// eslint-disable-next-line max-params
export function errorMiddleware(
  err: unknown | undefined,
  req: AppRequest,
  res: AppResponse,
  next: NextFunction,
): Promise<void> {
  if (err) {
    const errorResponse: AppError = getErrorResponse(err);
    if (errorResponse.httpStatusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.getInstance().log(LogLevel.Error, 'Runtime Error', err);
    }
    res.status(errorResponse.httpStatusCode).json(errorResponse);
  }

  return Promise.resolve();
}
