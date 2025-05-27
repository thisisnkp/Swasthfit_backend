const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Event = sequelize.define(
  "Event",
  {
    event_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_achievement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Events",
    timestamps: false,
  }
);

module.exports = Event;
