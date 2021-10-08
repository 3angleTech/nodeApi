/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { injectable } from 'inversify';
import { ModelCtor, Sequelize, ValidationError } from 'sequelize';
import { isNil } from '../common/utils';
import { Logger, LogLevel } from '../common/logger';
import { DatabaseModel, IDatabaseContext } from './database-context.interface';

const models = require('./sql-db/models');

@injectable()
export class DatabaseContext implements IDatabaseContext {
  private readonly sequelize: Sequelize;

  constructor() {
    this.sequelize = models.sequelize;
    this.initialize();
  }

  private initialize(): void {
    this.sequelize.authenticate().then(() => {
      Logger.getInstance().log(LogLevel.Info, 'Connection has been established successfully.');
    }).catch(err => {
      Logger.getInstance().log(LogLevel.Error, 'Unable to connect to the database:', err);
    });
  }

  public getModel(model: DatabaseModel): ModelCtor<any> {
    return models[model];
  }

  public async status(): Promise<boolean> {
    return this.sequelize.validate().then((validationErrors: ValidationError): boolean => {
      return isNil(validationErrors, 'errors') || validationErrors.errors.length === 0;
    }).catch((err): boolean => {
      Logger.getInstance().log(LogLevel.Error, 'DB connection error', err);
      return false;
    });
  }

}
