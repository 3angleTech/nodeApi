/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { NextFunction } from 'express';

import { AppRequest, AppResponse } from '../../../core';

export const refreshTokenGrantName: string = 'refresh_token';

export const accessTokenCookieName: string = 'accessToken';
export const refreshTokenCookieName: string = 'refreshToken';
export const authenticatedCookieName: string = 'authenticated';

/**
 * Provides authentication controller endpoints for the application.
 */
export interface IAuthController {
  /**
   * Provides the logic for the activation of an account.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  activateAccount(req: AppRequest, res: AppResponse, next: NextFunction): void;

  /**
   * Change the password for a given user.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  changePassword(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void>;

  /**
   * Creates an user account.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  createAccount(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void>;

  /**
   * Request a "forgot password" link that can be used to reset the password.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  forgotPassword(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void>;

  /**
   * Retrieves user data.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  getAccount(req: AppRequest, res: AppResponse, next: NextFunction): void;

  /**
   * Provides the log out logic.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  logout(req: AppRequest, res: AppResponse, next: NextFunction): void;

  /**
   * Reset the password for a given user.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  resetPassword(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void>;

  /**
   * Provides a new OAuth token for an authorized token request.
   *
   * @param req Request object data.
   * @param res Response object data.
   * @param next Middleware function to be called.
   */
  token(req: AppRequest, res: AppResponse, next: NextFunction): void;
}

export const IAuthController = Symbol.for('IAuthController');
