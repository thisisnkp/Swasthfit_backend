// // const { Model, DataTypes } = require("sequelize");
// // const sequelize = require("../../../sequelize");

// // const PERMISSION_TYPES = ["None", "All", "Added", "Owned", "Added & Own"];

// // class Permission extends Model {}

// // Permission.init(
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       autoIncrement: true,
// //       primaryKey: true,
// //     },
// //     module_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     can_add: {
// //       type: DataTypes.ENUM(...PERMISSION_TYPES),
// //       allowNull: true,
// //     },
// //     can_view: {
// //       type: DataTypes.ENUM(...PERMISSION_TYPES),
// //       allowNull: true,
// //     },
// //     can_update: {
// //       type: DataTypes.ENUM(...PERMISSION_TYPES),
// //       allowNull: true,
// //     },
// //     can_delete: {
// //       type: DataTypes.ENUM(...PERMISSION_TYPES),
// //       allowNull: true,
// //     },
// //     feature: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //   },
// //   {
// //     sequelize,
// //     modelName: "Permission",
// //     tableName: "Permissions",
// //     timestamps: false, // Set to true if you want created_at/updated_at
// //     underscored: true,
// //   },
// // );

// // module.exports = Permission;
// 'use strict';
// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../../../sequelize');

// class Permission extends Model {
//   static associate(models) {
//     Permission.belongsTo(models.Module, {
//       foreignKey: 'module_id',
//       as: 'module',
//     });

//     Permission.hasMany(models.RolePermission, {
//       foreignKey: 'permission_id',
//       as: 'rolePermissions',
//     });

//   }
// }

// Permission.init({
//   feature_name: {
//     type: DataTypes.STRING(100),
//     allowNull: false,
//   },
//   can_view: {
//     type: DataTypes.ENUM('None', 'All'),
//     defaultValue: 'None',
//   },
//   can_add: {
//     type: DataTypes.ENUM('None', 'All'),
//     defaultValue: 'None',
//   },
//   can_update: {
//     type: DataTypes.ENUM('None', 'All'),
//     defaultValue: 'None',
//   },
//   can_delete: {
//     type: DataTypes.ENUM('None', 'All'),
//     defaultValue: 'None',
//   },
//   module_id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// }, {
//   sequelize,
//   tableName: 'permissions',
//   timestamps: false,
// });

// module.exports = Permission;
// Permission.js
// models/Permission.js
"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust path

class Permission extends Model {
  static associate(models) {
    Permission.belongsTo(models.Module, {
      foreignKey: "module_id",
      as: "module", // Used in getModulesWithPermissionsByRole
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
      // Changed from feature_name to 'name' for consistency with frontend display
      type: DataTypes.STRING, // Changed from JSON
      allowNull: false,
    },
    feature_slug: {
      // A unique slug for the permission, e.g., "view_users", "create_order"
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        // Foreign key constraint
        model: "modules", // Name of the Modules table
        key: "id",
      },
    },
    // Storing can_view, can_add etc. directly on the Permission model might be redundant
    // if a permission inherently IS "can_view_X" or "can_add_Y".
    // The existence of a (Role, Permission) link grants that permission.
    // If you want different levels for a single "feature_name", then your ENUM approach for can_view etc. was okay,
    // but it makes querying complex.
    // For simplicity, let's assume each Permission record is a specific grantable right.
    // The can_view, can_add fields are removed from here; these are implicit in the permission's name/slug.
  },
  {
    sequelize,
    modelName: "Permission",
    tableName: "permissions",
    underscored: true,
    timestamps: true,
  },
);
module.exports = Permission;
