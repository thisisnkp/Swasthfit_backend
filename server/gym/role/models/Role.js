"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");
const RolePermission = require("./RolePermission");
class Role extends Model {
  static associate(models) {
    Role.hasMany(models.RolePermission, {
      foreignKey: "role_id",
      as: "rolePermissions",
    });
  }
}
Role.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: false,
  }
);
Role.hasMany(RolePermission, {
  foreignKey: "role_id",
  as: "rolePermissions",
});

module.exports = Role;
