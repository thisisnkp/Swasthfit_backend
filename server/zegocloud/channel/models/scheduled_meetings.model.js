const { DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");

const ScheduledMeetings = sequelize.define(
  "scheduled_meetings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meeting_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "cancelled", "completed"),
      defaultValue: "scheduled",
    },
  },
  {
    tableName: "scheduled_meetings",
    timestamps: false,
  }
);

module.exports = ScheduledMeetings;
