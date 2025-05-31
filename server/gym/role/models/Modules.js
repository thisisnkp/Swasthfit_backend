"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");
const Permission = require("./Permission");
class Module extends Model {
  static associate(models) {
    Module.hasMany(models.Permission, {
      foreignKey: "module_id",
      as: "permissions",
    });
  }
}

Module.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Module",
    tableName: "gym_modules",
    timestamps: false,
  }
);
Module.hasMany(Permission, {
  foreignKey: "module_id",
  as: "permissions",
});
Permission.belongsTo(Module, {
  foreignKey: "module_id",
  as: "module",
});
module.exports = Module;
