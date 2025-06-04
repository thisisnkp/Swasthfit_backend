"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust as per your project

class Module extends Model {
  static associate(models) {
    // Associations should be defined in index.js, but defining it here if needed
    Module.hasMany(models.Permission, {
      foreignKey: "module_id",
      as: "permissions",
    });
  }
}

Module.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Module",
    tableName: "modules",
    underscored: true,
    timestamps: true, // Keeps created_at and updated_at
  }
);

module.exports = Module;
