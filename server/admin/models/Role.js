
'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const RolePermission = require("../models/RolePermission")
class Role extends Model {
  static associate(models) {
    // Define the association here
    Role.hasMany(models.RolePermission, {
      foreignKey: 'role_id',
      as: 'rolePermissions',
    });
  }
}
Role.init({
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true, 
  },
}, {
  sequelize,
  tableName: 'roles',
  timestamps: false,
});
// Remove the duplicate association definition below:
// Role.hasMany(RolePermission, {
//   foreignKey: 'role_id',
//   as: 'rolePermissions',
// });

module.exports = Role;
