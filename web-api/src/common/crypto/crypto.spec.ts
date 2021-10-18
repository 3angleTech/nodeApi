/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { expect } from 'chai';

import { encrypt, verify } from './crypto';

describe('Crypto Service', () => {
  it('Should encrypt and verify a string', () => {
    const original = 'test132_21';
    const encrypted = encrypt(original);
    expect(encrypted).to.not.equal(original, 'Encrypted text should not be equal with the original');

    const result = verify(original, encrypted);
    expect(result).to.equal(true, 'Verify function should return true for the encrypted text.');
  });
});
