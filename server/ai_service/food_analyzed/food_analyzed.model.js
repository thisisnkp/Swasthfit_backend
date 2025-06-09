"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class FoodAnalyzed extends Model {}

FoodAnalyzed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    food_discription: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "FoodAnalyzed",
    tableName: "food_analyzed",
    timestamps: false,
  }
);

module.exports = FoodAnalyzed;
