/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import { BOOLEAN, DATE, INTEGER, QueryInterface, STRING } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER,
      },
      username: {
        allowNull: false,
        type: STRING,
      },
      password: {
        allowNull: false,
        type: STRING,
      },
      email: {
        allowNull: false,
        type: STRING,
      },
      first_name: {
        type: STRING,
      },
      last_name: {
        type: STRING,
      },
      active: {
        type: BOOLEAN,
        defaultValue: false,
      },
      created_by: {
        allowNull: false,
        type: INTEGER,
      },
      updated_by: {
        allowNull: false,
        type: INTEGER,
      },
      created_at: {
        allowNull: false,
        type: DATE,
      },
      updated_at: {
        allowNull: false,
        type: DATE,
      },
    });
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable('users');
  },
};
