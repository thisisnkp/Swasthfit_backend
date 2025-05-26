const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust path to your Sequelize instance

const Channel = sequelize.define("Channel", {
  channelName: { type: DataTypes.STRING, allowNull: false, unique: true },
  participant1: { type: DataTypes.STRING, allowNull: false }, // user ID
  participant2: { type: DataTypes.STRING, allowNull: false }, // trainer ID
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("scheduled", "active", "completed"),
    defaultValue: "scheduled",
  },
});

module.exports = Channel;
