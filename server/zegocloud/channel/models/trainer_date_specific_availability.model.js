const { DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");

const TrainerDateSpecificAvailability = sequelize.define(
  "trainer_date_specific_availability",
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
    available_date: {
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
  },
  {
    tableName: "trainer_date_specific_availability",
    timestamps: false,
  }
);

module.exports = TrainerDateSpecificAvailability;
