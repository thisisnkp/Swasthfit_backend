// ../role/models/Role.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Adjust path if needed
// const RolePermission = require("./RolePermission"); // RolePermission is associated in RolePermission.js

class Role extends Model {
  static associate(models) {
    Role.hasMany(models.RolePermission, {
      foreignKey: "role_id",
      as: "rolePermissions", // This alias will be used in queries
    });
    // If GymOwner has a foreign key role_id pointing to Role
    Role.hasMany(models.GymOwner, {
      // Assuming GymOwner model is named 'GymOwner'
      foreignKey: "role_id",
      as: "staffMembers", // Or 'gymOwners'
    });
  }
}

Role.init(
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      // unique: true, // Unique constraint should be per gym_id. (name, gym_id) should be unique together.
    },
    gym_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // A role must belong to a gym
    },
    staff_id: {
      // This seems to imply a role is tied to a specific staff member, which is unusual.
      // Usually, a role is a template, and staff members are assigned a role.
      // If this 'staff_id' means 'created_by_staff_id', it's different.
      // For now, keeping as is.
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Role", // Added modelName for consistency
    tableName: "gym_roles",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["name", "gym_id"], // Ensures role name is unique within a specific gym
      },
    ],
  }
);

// If you have a central model index.js that calls associate, this is not needed here.
// const RolePermission = require("./RolePermission");
// Role.hasMany(RolePermission, {
//   foreignKey: "role_id",
//   as: "rolePermissions",
// });

module.exports = Role;
