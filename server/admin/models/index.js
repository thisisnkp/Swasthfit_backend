const Sequelize = require('sequelize');
const sequelize = require('../../../sequelize'); // adjust this path if needed

const Role = require('./Role');
const Module = require('./Modules');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');

const models = {
  Role,
  Module,
  Permission,
  RolePermission,
};

// Initialize associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models); // pass all models to associate
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
