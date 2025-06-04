"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Update path if needed

class Permission extends Model {
  static associate(models) {
    Permission.belongsTo(models.Module, {
      foreignKey: "module_id",
      as: "module",
    });

    Permission.hasMany(models.RolePermission, {
      foreignKey: "permission_id",
      as: "rolePermissions",
      onDelete: "CASCADE",
    });
  }
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feature_slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modules",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Permission;
