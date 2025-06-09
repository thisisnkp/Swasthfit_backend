const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const BodyPart = sequelize.define(
  "BodyPart",
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
    tableName: "bodyParts",
    timestamps: false,
  }
);

module.exports = BodyPart;
