<<<<<<< HEAD
// models/Modules.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const Permission = require("../models/Permission"); // This direct require can cause circular dependencies

const sequelize = require("../../../sequelize"); // Adjust path to your sequelize instance

class Module extends Model {
  static associate(models) {
    Module.hasMany(models.Permission, {
      foreignKey: "module_id",
      as: "permissions", // This alias is used by getAllModulesWithPermissions
    });
  }
}
Module.init(
  {
    id: {
      // Ensure 'id' field is defined as primary key
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // Module names should be unique
    },
  },
  {
    sequelize,
    modelName: "Module",
    tableName: "modules",
    underscored: true, // Recommended for consistency
    timestamps: true, // Usually good to have timestamps
  },
);
module.exports = Module;
=======

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

>>>>>>> restaurent_backend
