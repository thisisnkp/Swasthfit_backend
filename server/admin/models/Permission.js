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
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const Module = require("../models/Modules")
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

Permission.init({
  feature_name: {
  type: DataTypes.JSON,
  allowNull: false,
},

  can_view: {
    type: DataTypes.ENUM('None', 'All'),
    defaultValue: 'None',
  },
  can_add: {
    type: DataTypes.ENUM('None', 'All'),
    defaultValue: 'None',
  },
  can_update: {
    type: DataTypes.ENUM('None', 'All'),
    defaultValue: 'None',
  },
  can_delete: {
    type: DataTypes.ENUM('None', 'All'),
    defaultValue: 'None',
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Permission',
  tableName: 'permissions',
  timestamps: false,
});


module.exports = Permission;
