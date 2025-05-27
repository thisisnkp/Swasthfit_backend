"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");
const Module = require("./Modules");
class Permission extends Model {
  static associate(models) {
    // Permission.belongsTo(models.Module, { // ✅ FIXED
    //   foreignKey: 'module_id',
    //   as: 'module',
    // });
    // Permission.hasMany(models.RolePermission, {
    //   foreignKey: 'permission_id',
    //   as: 'rolePermissions',
    // });
  }
}

Permission.init(
  {
    feature_name: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    can_view: {
      type: DataTypes.ENUM("None", "All"),
      defaultValue: "None",
    },
    can_add: {
      type: DataTypes.ENUM("None", "All"),
      defaultValue: "None",
    },
    can_update: {
      type: DataTypes.ENUM("None", "All"),
      defaultValue: "None",
    },
    can_delete: {
      type: DataTypes.ENUM("None", "All"),
      defaultValue: "None",
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
    timestamps: false,
  }
);

module.exports = Permission;
