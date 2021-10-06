/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';

import * as config from 'config';
import { isString } from 'lodash';

interface DatabaseConfiguration {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
}

const dbConnection = config.get<DatabaseConfiguration>('db-connection');
const port = isString(dbConnection.port) ? parseInt(dbConnection.port, 10) : dbConnection.port;

module.exports = {
  username: dbConnection.username,
  password: dbConnection.password,
  database: dbConnection.database,
  host: dbConnection.host,
  port: port,
  dialect: dbConnection.dialect,
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'data_meta',
  // eslint-disable-next-line no-console
  logging: console.log,
};
