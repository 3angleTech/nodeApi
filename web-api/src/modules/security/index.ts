/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { Container } from 'inversify';

import { AuthController } from './controllers/auth.controller';
import { IAuthController } from './controllers/auth.controller.interface';
import { ISandboxController, SandboxController } from './controllers/sandbox.controller';
import { AccountService } from './services/account.service';
import { IAccountService } from './services/account.service.interface';
import { JwtTokenService } from './services/jwt-token.service';
import { IJwtTokenService } from './services/jwt-token.service.interface';
import { OAuthServer } from './services/oauth-server';
import { OAuthServerModel } from './services/oauth-server-model';
import { IOAuthServerModel } from './services/oauth-server-model.interface';
import { IOAuthServer } from './services/oauth-server.interface';

export function bindDependencies(container: Container): void {
  container.bind<IAccountService>(IAccountService).to(AccountService).inSingletonScope();
  container.bind<IJwtTokenService>(IJwtTokenService).to(JwtTokenService);
  container.bind<IOAuthServerModel>(IOAuthServerModel).to(OAuthServerModel);
  container.bind<IOAuthServer>(IOAuthServer).to(OAuthServer).inSingletonScope();

  container.bind<IAuthController>(IAuthController).to(AuthController);
  container.bind<ISandboxController>(ISandboxController).to(SandboxController);
}

export * from './services/account.service.interface';
export * from './services/oauth-server.interface';
export * from './controllers/auth.controller.interface';
export * from './controllers/sandbox.controller';
export * from './middlewares/authenticated-user.middleware';
export * from './middlewares/valid-access-token.middleware';
