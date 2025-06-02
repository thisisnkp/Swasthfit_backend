// 'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const FoodRestaurant = require("../models/Restaurant");
const FoodItem = require("../models/FoodItem")
const User = require("../../user/user.model")
class FoodOrders extends Model {}

FoodOrders.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.STRING(8),
        unique: true,
    },
    restaurant_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: FoodRestaurant,
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address_details: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      item_details: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      
      Payment_via:{
        type: DataTypes.STRING,
       
      },
   
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
    },
}, {
    sequelize,
    modelName: 'FoodOrders',
    tableName: 'foodorders',
    timestamps: true,
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt',
    underscored: false,
    
    
});


module.exports = FoodOrders;
