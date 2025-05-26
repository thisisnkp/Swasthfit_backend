const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Competition = sequelize.define(
  "Competition",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    icon_url: {
      type: DataTypes.STRING,
      allowNull: true,
      //defaultValue: "/uploads/competitions/default.jpg",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "competitions", // Ensure the table name matches
    timestamps: false, // Disable timestamps if not needed
  }
);

module.exports = Competition;
