const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const UserMembershipPlan = sequelize.define(
  "UserMembershipPlan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    read_access: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    update_access: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    create_access: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    delete_access: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: "user_membership_plans",
  }
);

module.exports = UserMembershipPlan;
