// ../role/models/Modules.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Adjust path if needed

class Module extends Model {
  static associate(models) {
    // Define the association that your controller is trying to use
    Module.hasMany(models.Permission, {
      foreignKey: "module_id",
      as: "permissions", // This 'as' must match the one in your controller's include
    });
  }
}

Module.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Module",
    tableName: "gym_modules",
    timestamps: false,
  }
);

module.exports = Module;
