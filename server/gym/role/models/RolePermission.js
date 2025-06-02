// ../role/models/RolePermission.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Adjust path if needed

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
      primaryKey: true, // Part of composite primary key
      references: {
        // Optional: Add foreign key constraint
        model: "gym_roles", // table name for Role
        key: "id",
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Part of composite primary key
      references: {
        // Optional: Add foreign key constraint
        model: "gym_permissions", // table name for Permission
        key: "id",
      },
    },
    // Role-specific grants for actions
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
  },
  {
    sequelize,
    modelName: "RolePermission",
    tableName: "gym_role_permissions",
    timestamps: false,
    // Sequelize will automatically create a composite primary key on (role_id, permission_id)
    // if no other primary key is defined. Explicitly defining them as primaryKey: true is also fine.
  }
);

module.exports = RolePermission;
