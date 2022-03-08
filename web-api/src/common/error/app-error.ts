/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import * as HttpStatus from 'http-status-codes';

export interface IAppErrorParameters {
  httpStatusCode?: number;
  message?: string;
  name: string;
  originalError?: unknown;
}

export class AppError extends Error implements IAppErrorParameters {
  public readonly httpStatusCode: number;
  public readonly message: string;
  public readonly name: string;
  public readonly originalError?: unknown;

  constructor(parameters: IAppErrorParameters) {
    // NOTE: To avoid `enumerable: false` issues, the Error class is called without any arguments.
    super();
    this.httpStatusCode = parameters.httpStatusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    this.message = parameters.message || HttpStatus.getStatusText(this.httpStatusCode);
    this.name = parameters.name;
    this.originalError = parameters.originalError || undefined;
  }
}
