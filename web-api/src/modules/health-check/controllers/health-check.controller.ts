/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { AppRequest, AppResponse } from '../../../core';
import { IDatabaseContext } from '../../../data';
import { IHealthCheckController } from './health-check.controller.interface';

@injectable()
export class HealthCheckController implements IHealthCheckController {

  constructor(
    @inject(IDatabaseContext) private readonly dbContext: IDatabaseContext,
  ) {
    this.run = this.run.bind(this);
  }

  public async run(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
    const dbStatus = await this.dbContext.status();
    res.json({
      status: 'Running',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    });
  }
}
