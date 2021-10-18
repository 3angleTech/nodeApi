/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { QueryInterface } from 'sequelize';

import { encrypt } from '../../../common/crypto';
import { ANONYMOUS_USER_ID } from '../../../modules/security';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkInsert('users', [
      {
        username: 'ionut',
        password: encrypt('qW12!@'),
        email: 'ionut@3angle.tech',
        first_name: 'Ionut Cristian',
        last_name: 'Paraschiv',
        created_by: ANONYMOUS_USER_ID,
        updated_by: ANONYMOUS_USER_ID,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
