/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */

import {
  BOOLEAN,
  DATE,
  INTEGER,
  ModelType,
  Sequelize,
  STRING,
} from 'sequelize';

module.exports = (sequelize: Sequelize): ModelType => {
  const users: ModelType = sequelize.define('Users', {
    username: { type: STRING, field: 'username' },
    password: { type: STRING, field: 'password' },
    email: { type: STRING, field: 'email' },
    firstName: { type: STRING, field: 'first_name' },
    lastName: { type: STRING, field: 'last_name' },
    active: { type: BOOLEAN, field: 'active' },
    createdBy: { type: INTEGER, field: 'created_by' },
    updatedBy: { type: INTEGER, field: 'updated_by' },
    createdAt: { type: DATE, field: 'created_at' },
    updatedAt: { type: DATE, field: 'updated_at' },
  }, {
    tableName: 'users',
    underscored: true,
  });
  return users;
};
