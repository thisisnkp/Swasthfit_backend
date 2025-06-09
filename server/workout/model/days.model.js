const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Day = sequelize.define(
  "Day",
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
  },
  {
    tableName: "days",
    timestamps: false,
  }
);

module.exports = Day;
