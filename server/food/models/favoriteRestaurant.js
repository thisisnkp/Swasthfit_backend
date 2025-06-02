"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

class FavoriteRestaurants extends Model {}

FavoriteRestaurants.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "FoodFavoriteResturants",
    tableName: "foodfavoriteresturants",
    underscored: true,
    timestamps: false,
  },
);

module.exports = FavoriteRestaurants;
