
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const FoodItem = require("../models/FoodItem");

class UserProductAction extends Model {}

UserProductAction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fooditems',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    module_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.ENUM('single_view', 'add_to_cart', 'add_to_wishlist', 'buy'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserProductAction",
    tableName: "user_product_action",
    underscored: true,
    timestamps: true,
  }
);

module.exports = UserProductAction;
