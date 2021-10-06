/**
 * @license
 * Copyright (c) 2020 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import * as HttpStatus from 'http-status-codes';

import { AppError } from './app-error';

// eslint-disable-next-line complexity
function getStatusFromError(err: unknown): number {
  if (Object.prototype.hasOwnProperty.call(err, 'message')) {
    if (err['message'] instanceof AppError) {
      return err['message'].httpStatusCode;
    }
  }
  if (Object.prototype.hasOwnProperty.call(err, 'inner')) {
    if (err['inner'] instanceof AppError) {
      return err['inner'].httpStatusCode;
    }
  }
  if (Object.prototype.hasOwnProperty.call(err, 'status') && typeof err['status'] === 'number') {
    return err['status'];
  } else if (Object.prototype.hasOwnProperty.call(err, 'statusCode') && typeof err['statusCode'] === 'number') {
    return err['statusCode'];
  } else if (Object.prototype.hasOwnProperty.call(err, 'code') && typeof err['code'] === 'number') {
    return err['code'];
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}

export function getErrorResponse(err: unknown): AppError {
  if (err instanceof AppError) {
    // NOTE: The original error is not returned to the user.
    return new AppError({
      httpStatusCode: err.httpStatusCode,
      message: err.message,
      name: err.name,
    });
  } else if (typeof err === 'string') {
    return new AppError({
      httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: err,
      name: 'INTERNAL_SERVER_ERROR',
    });
  } else if (typeof err !== 'object') {
    return new AppError({
      httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
      name: 'INTERNAL_SERVER_ERROR',
    });
  }

  let innerError: unknown;
  if (err['inner'] !== undefined) {
    innerError = err['inner'];
  } else if (err['message'] !== undefined) {
    innerError = err['message'];
  }

  const statusCode = getStatusFromError(err);
  if (innerError instanceof AppError) {
    return new AppError({
      httpStatusCode: statusCode,
      message: innerError.message,
      name: innerError.name,
    });
  } else if (innerError instanceof Error) {
    return new AppError({
      httpStatusCode: statusCode,
      message: innerError.message,
      name: 'UNKNOWN_ERROR',
    });
  } else if (typeof innerError === 'string') {
    return new AppError({
      httpStatusCode: statusCode,
      message: innerError,
      name: 'UNKNOWN_ERROR',
    });
  }

  return new AppError({
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
    name: 'INTERNAL_SERVER_ERROR',
  });
}
