// models/Role.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust path to your sequelize instance

class Role extends Model {
  static associate(models) {
    Role.hasMany(models.RolePermission, {
      foreignKey: "role_id",
      as: "rolePermissions", // This alias is used by your getRoles controller
      onDelete: "CASCADE", // If a role is deleted, its entries in RolePermission are also deleted
    });
  }
}
Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_system_role: {
      // Good to have to protect core roles like 'Super Admin'
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // created_at and updated_at are handled by timestamps: true
  },
  {
    sequelize,
    modelName: "Role",
    tableName: "roles", // Ensure your table name is 'roles'
    underscored: true,
    timestamps: true,
  },
);
module.exports = Role;
