// models/UserActivity.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust the path as needed

const UserActivity = sequelize.define(
  "UserActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    achieved_target: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    coins_earned: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = UserActivity;
