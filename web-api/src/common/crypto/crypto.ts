/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { compareSync, genSaltSync, hashSync } from 'bcrypt-nodejs';

export function encrypt(value: string): string {
  const saltSync = genSaltSync();
  return hashSync(value, saltSync);
}

export function verify(original: string, encrypted: string): boolean {
  return compareSync(original, encrypted);
}
