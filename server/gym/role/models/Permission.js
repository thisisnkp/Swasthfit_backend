// ../role/models/Permission.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Adjust path if needed

class Permission extends Model {
  static associate(models) {
    // Define the other side of the association
    Permission.belongsTo(models.Module, {
      foreignKey: "module_id",
      as: "module", // This alias can be used when querying from Permission to get Module
    });

    // Assuming RolePermission association is also needed:
    Permission.hasMany(models.RolePermission, {
      foreignKey: "permission_id",
      as: "rolePermissions",
    });
  }
}

Permission.init(
  {
    feature_name: {
      type: DataTypes.STRING, // Assuming you've adopted the STRING change from previous advice
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
      // Optional: Add foreign key constraint (ensure 'gym_modules' is correct table name)
      // references: {
      //   model: 'gym_modules',
      //   key: 'id',
      // },
    },
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "gym_permissions",
    timestamps: false,
  }
);

module.exports = Permission;
