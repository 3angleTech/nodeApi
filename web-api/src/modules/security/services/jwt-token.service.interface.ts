/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

export interface TokenGenerateOptions {
  userId: number;
  clientId: string;
  clientSecret: string;
  expirySeconds: number;
  grants: string[];
}

export interface TokenPayload {
  userId: number;
  clientId: string;
  grants: string[];
  issuer: string;
  expiresAt: Date;
}

export function isTokenPayload(value: unknown): value is TokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const keys = Object.keys(value);
  return keys.includes('userId') &&
    keys.includes('clientId') &&
    keys.includes('grants') &&
    keys.includes('issuer') &&
    keys.includes('expiresAt');
}

/**
 * Performs actions related to the JWT token.
 */
export interface IJwtTokenService {
  /**
   * Generates a new JWT token.
   * @param options Parameters to set up the token.
   */
  generate(options: TokenGenerateOptions): Promise<string>;

  /**
   * Verifies the validity of a JWT token.
   * @param token The JWT token to be verified.
   * @param clientSecret The client-side secret used for token generation.
   */
  verify(token: string, clientSecret: string): Promise<TokenPayload>;
}
export const IJwtTokenService = Symbol.for('IJwtTokenService');
