/* eslint-disable @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires */
/**
 * @license
 * Copyright (c) 2018 THREEANGLE SOFTWARE SOLUTIONS SRL
 * Available under MIT license webApi/LICENSE
 */
const fs = require('fs');
const path = require('path');

const Sequelize = require('sequelize');

const dbConfig = require('../config');

const basename = path.basename(__filename);

// TODO: #40 Refactor this file to avoid creating connections on import.
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
const db: any = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    // eslint-disable-next-line no-magic-numbers
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
