
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const Permission = require("../models/Permission")
class Module extends Model {
  static associate(models) {
    // Define the association here
    Module.hasMany(models.Permission, {
      foreignKey: 'module_id',
      as: 'permissions',
    });
  }
}

Module.init({
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Module',
  tableName: 'modules',
  timestamps: false,
});
// Remove the duplicate association definition below:
// Module.hasMany(Permission, {
//   foreignKey: 'module_id',
//   as: 'permissions',
// });

Permission.belongsTo(Module, {
  foreignKey: 'module_id',
  as: 'module',
});
module.exports = Module;

