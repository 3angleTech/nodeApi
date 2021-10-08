/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { NextFunction } from 'express';
import { UnauthorizedError } from '../../../common/error';
import { isNil } from '../../../common/utils';
import { AppRequest, AppResponse, UserContext } from '../../../core';
import { IPasswordResetRequest } from '../services/account.service.interface';

export async function validAccessTokenMiddleware(req: AppRequest, res: AppResponse, next: NextFunction): Promise<void> {
  // When resetToken is sent via URL, we initialize the authorization header used by the oauth middleware
  const passwordResetReq: IPasswordResetRequest = req.body;
  if (!isNil(passwordResetReq)) {
    const accessToken: string = decodeURIComponent(passwordResetReq.token);
    req.headers.authorization = `Bearer ${accessToken}`;
  }
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
    return next(new UnauthorizedError(err));
  }
}
