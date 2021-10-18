/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

export enum LogLevel {
  Debug,
  Info,
  Warning,
  Error,
}

/**
 * Allows logging messages with different debugging levels.
 */
export interface ILogger {
  /**
   * Logs a message.
   *
   * @param level The log level.
   * @param message The log message.
   * @param optionalParams Stack traces or any other objects.
   */
  log(level: LogLevel, message: string, ...optionalParams: unknown[]): void;
}
