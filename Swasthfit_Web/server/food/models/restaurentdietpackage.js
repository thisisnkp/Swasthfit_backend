
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const ClientDietPlan = require("../models/clientdietplan");
const FoodRestaurant = require("../models/Restaurant");
class RestaurantDietPlan extends Model {}

RestaurantDietPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_diet_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ClientDietPlan,  // references ClientDietPlan model
        key: 'id',  // references 'id' in ClientDietPlan
      },
      onDelete: 'CASCADE',
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breakfast_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FoodRestaurant,  // references ClientDietPlan model
        key: 'id',  // references 'id' in ClientDietPlan
      },
      onDelete: 'CASCADE',
    },
    lunch_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dinner_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    snacks_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    combo_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    optional_item_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      allowNull: true,
      defaultValue: "Pending",
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ClientDietPlanRestaurant",
    tableName: "restaurant_diet_plans",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
module.exports = RestaurantDietPlan;