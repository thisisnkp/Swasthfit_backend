// models/Activity.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust the path as needed

const Activity = sequelize.define(
  "Activity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    base_coin_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    daily_target: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    max_daily_scans: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    scan_rewards: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    streak_bonuses: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Activity;
