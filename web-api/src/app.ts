/* eslint-disable @typescript-eslint/unbound-method */
/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
import { json, urlencoded } from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Express, NextFunction, Request, Response, Router } from 'express';

import { appContainer } from './app.inversify.config';
import { errorMiddleware } from './common/error';
import { AppContext, AppRequest, AppResponse, UserContext } from './core';
import { IDatabaseContext } from './data';
import { IHealthCheckController } from './modules/health-check';
import { authenticatedUserMiddleware, IAuthController, ISandboxController, validAccessTokenMiddleware } from './modules/security';
import { createExpressApplication, createExpressRouter } from './other/express.factory';
import { version } from './version';

export class App {
  public readonly express: Express;

  private authController: IAuthController;
  private healthCheckController: IHealthCheckController;
  private sandboxController: ISandboxController;

  constructor() {
    this.express = createExpressApplication();
    this.enableCORS();
    this.initialize();
    this.initControllers();
    this.registerMiddlewares();
    this.registerRoutes();
  }

  /**
   * Configure server to deal with CORS.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
   */
  private enableCORS(): void {
    this.express.all('/*', (req: Request, res: Response, next: NextFunction): void => {
      const origin: string = req.headers.origin || '*';
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'POST,PUT,GET,DELETE');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

      return next();
    });
  }

  private initialize(): void {
    /**
     * IDatabaseContext is a singleton scoped service
     * We force its instantiation to make sure the database connection is initialized.
     */
    appContainer.get<IDatabaseContext>(IDatabaseContext);

    /**
     * Make appContext available across the application.
     */
    this.express.locals.appContext = new AppContext(appContainer);
  }

  private initControllers(): void {
    this.healthCheckController = appContainer.get<IHealthCheckController>(IHealthCheckController);
    this.authController = appContainer.get<IAuthController>(IAuthController);
    this.sandboxController = appContainer.get<ISandboxController>(ISandboxController);
  }

  private registerMiddlewares(): void {
    this.express.use(cookieParser());
    this.express.use(urlencoded({ extended: true }));
    this.express.use(json());

    this.express.use((req: Request, res: Response, next: NextFunction): void => {
      res.header('X-WebApiVersion', version);
      /**
       * Expose the custom header to cross-origin requests.
       *
       * @see https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header
       */
      res.header('Access-Control-Expose-Headers', 'X-WebApiVersion');
      next();
    });

    this.express.use((req: Request, res: Response, next: NextFunction): void => {
      const appReq: AppRequest = req as AppRequest;
      appReq.getAppContext = (): AppContext => {
        return appReq.app.locals.appContext;
      };

      const appRes: AppResponse = res as AppResponse;
      appRes.getUserContext = (): UserContext => {
        return appRes.locals.userContext;
      };

      return next();
    });
  }

  private registerRoutes(): void {
    const router: Router = createExpressRouter();

    router.route('/health-check')
      .get(this.healthCheckController.run);

    router.route('/auth/token')
      .post(this.authController.token);
    router.route('/auth/logout')
      .get(this.authController.logout);

    router.route('/account/me')
      .get(authenticatedUserMiddleware, this.authController.getAccount);
    router.route('/account/create')
      .post(this.authController.createAccount);
    router.route('/account/activate')
      .get(this.authController.activateAccount);

    router.route('/account/change-password')
      .post(authenticatedUserMiddleware, this.authController.changePassword);
    router.route('/account/forgot-password')
      .post(this.authController.forgotPassword);
    router.route('/account/reset-password')
      .post(validAccessTokenMiddleware, this.authController.resetPassword);

    router.route('/sandbox/send-mail/:userId')
      .get(this.sandboxController.sendActivationMail);

    this.express.use('/api/v1', router);
    this.express.use(errorMiddleware);
  }
}

export function appFactory(): Express {
  return new App().express;
}
