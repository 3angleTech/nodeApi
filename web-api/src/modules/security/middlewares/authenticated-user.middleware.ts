/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { NextFunction } from 'express';
import { UnauthorizedError } from '../../../common/error';
import { isNil } from '../../../common/utils';
import { AppRequest, AppResponse, UserContext } from '../../../core';
import {
  accessTokenCookieName,
  authenticatedCookieName,
  refreshTokenCookieName,
} from '../controllers/auth.controller.interface';

export async function authenticatedUserMiddleware(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
  // When accessToken is sent via cookie, we initialize the authorization header used by the oauth middleware
  const accessToken = req.cookies[accessTokenCookieName];
  if (isNil(accessToken)) {
    res.clearCookie(accessTokenCookieName);
    res.clearCookie(refreshTokenCookieName);
    res.clearCookie(authenticatedCookieName);

    return next(new UnauthorizedError({
      name: 'UNAUTHORIZED_REQUEST',
      message: 'Unauthorized request.',
    }));
  }
  req.headers.authorization = `Bearer ${accessToken}`;

  try {
    const oauthServer = req.getAppContext().getOAuthServer();
    const token = await oauthServer.authenticate(req, res);
    const accountService = req.getAppContext().getAccountService();
    const user = await accountService.find(token.user.id);
    const userContext: UserContext = {
      user: user,
    };
    res.locals.userContext = userContext;
    return next();
  } catch (err) {
    return next(new UnauthorizedError({
      name: 'UNAUTHORIZED_REQUEST',
      message: 'Unauthorized request.',
      originalError: err,
    }));
  }
}
