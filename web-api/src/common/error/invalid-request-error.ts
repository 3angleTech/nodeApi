/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import * as HttpStatus from 'http-status-codes';

import { AppError, IAppErrorParameters } from './app-error';

export class InvalidRequestError extends AppError {
  constructor(options: IAppErrorParameters) {
    options.httpStatusCode = options.httpStatusCode || HttpStatus.BAD_REQUEST;
    super(options);
  }
}
