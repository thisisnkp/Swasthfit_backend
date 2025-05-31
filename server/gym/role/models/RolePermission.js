"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");

class RolePermission extends Model {
  static associate(models) {
    RolePermission.belongsTo(models.Role, {
      foreignKey: "role_id",
      as: "role",
    });

    RolePermission.belongsTo(models.Permission, {
      foreignKey: "permission_id",
      as: "permission",
    });
  }
}

RolePermission.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "gym_role_permissions",
    timestamps: false,
  }
);

module.exports = RolePermission;
