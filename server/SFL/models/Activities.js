// models/Activity.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust the path as needed
const { combineTableNames } = require("sequelize/lib/utils");

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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    streak_bonuses: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "activities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Activity;
