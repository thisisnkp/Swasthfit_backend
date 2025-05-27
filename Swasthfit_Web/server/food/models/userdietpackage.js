const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const FoodRestaurant = require("../models/Restaurant");
const DietPackage = require("../models/dietpackage");

class RestaurantDietPackage extends Model {}

RestaurantDietPackage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      references: {
        model: FoodRestaurant, // The associated restaurant model
        key: 'id', // The key that links to the restaurant model
      },
    },
    diet_package_id: {
      type: DataTypes.INTEGER,
      references: {
        model: DietPackage, // The associated diet package model
        key: 'id', // The key that links to the diet package model
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending", // Default status is 'pending'
    },
    breakfast_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lunch_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dinner_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    combo_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "RestaurantDietPackage",
    tableName: "user_diet_packages",
    timestamps: false,
  }
);

module.exports = RestaurantDietPackage;
