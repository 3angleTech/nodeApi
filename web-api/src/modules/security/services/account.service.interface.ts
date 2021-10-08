/**
 * @license
 * Copyright (c) 2019 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { User } from '../../../data';

export interface Credentials {
  username: string;
  password: string;
}

export interface IPasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IPasswordResetRequest {
  token: string;
  newPassword: string;
}

/**
 * Provides an ID to be used for anonymous users.
 */
export const ANONYMOUS_USER_ID: number = -1;

/**
 * Handles action related to users' accounts.
 */
export interface IAccountService {
  /**
   * Verifies credentials and returns the user if found.
   *
   * @param credentials User's credentials.
   */
  verify(credentials: Credentials): Promise<User>;

  /**
   * Looks for a user based on it's id and returns it if found.
   *
   * @param userId User's id.
   */
  find(userId: number): Promise<User>;

  /**
   * Looks for a user based on the value of the  given field.
   *
   * @param field  The name of the lookup field
   * @param value  The value of the lookup field
   */
  findByField(field: string, value: any): Promise<User>;

  /**
   * Activates an user's account based on the provided token.
   *
   * @param token Activation token.
   */
  activate(token: string): Promise<void>;

  /**
   * Generates an activation token for activating a user's account.
   *
   * @param user The user object
   */
  generateActivationToken(user: User): Promise<string>;

  /**
   * Creates an user account.
   *
   * @param newUserPartial The user object
   * @param createdBy The ID of the user who made this request.
   */
  create(newUserPartial: Partial<User>, createdBy: number): Promise<void>;

  /**
   * Updates an user account.
   *
   * @param userPartial A partial user object that contains the desired changes.
   * @param updatedBy The ID of the user who made this request.
   */
  update(userPartial: Partial<User>, updatedBy: number): Promise<void>;
}

export const IAccountService = Symbol.for('IAccountService');
