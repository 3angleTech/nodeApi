/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { IAccountService, IOAuthServer } from '../modules/security';

export class AppContext {
  public constructor(
    private readonly container: Container,
  ) { }

  public getOAuthServer(): IOAuthServer {
    return this.container.get(IOAuthServer);
  }

  public getAccountService(): IAccountService {
    return this.container.get(IAccountService);
  }

}
