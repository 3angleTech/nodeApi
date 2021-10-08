/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { appFactory } from './app';
import { Logger, LogLevel } from './common/logger';

const defaultPortNumber: number = 3000;
const port: number = Number(process.env.PORT) || defaultPortNumber;

appFactory().listen(port).on('listening', (): void => {
  Logger.getInstance().log(LogLevel.Info, `Server is listening on port ${port}`);
}).on('error', (err: any): void => {
  Logger.getInstance().log(LogLevel.Error, 'The server could not be started.', err);
  const errorCode = 1;
  process.exit(errorCode);
});
