const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Exercise = sequelize.define(
  "Exercise",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "exercises",
    timestamps: false,
  }
);

module.exports = Exercise;
