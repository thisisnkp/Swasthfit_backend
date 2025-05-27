const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const UserStreak = sequelize.define(
  "UserStreak",
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
    current_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_activity_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "UserStreaks",
    timestamps: false, // Disable timestamps since they don't exist in the table
  }
);

module.exports = UserStreak;
