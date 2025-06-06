// models/Cart.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const FoodItem = require("./FoodItem");

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fooditem_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "foodcarts",
    underscored: true,
    timestamps: true,
  }
);

// 🧩 Associations
Cart.belongsTo(FoodItem, {
  foreignKey: "fooditem_id",
  as: "foodItem",
  onDelete: "CASCADE",
});
FoodItem.hasMany(Cart, {
  foreignKey: "fooditem_id",
  as: "cartItems",
  onDelete: "CASCADE",
});

module.exports = Cart;
