const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const ManageRoles = sequelize.define(
  "ManageRoles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    accounting: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    user_management: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    user_membership_plans: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    create_gym: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: false,
    tableName: "manage_roles",
  }
);

module.exports = ManageRoles;
