const { DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize");

const Order = sequelize.define("Order", {
    vendorId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.ENUM("Pending", "Shipped", "Delivered", "Cancelled"), defaultValue: "Pending" },
  }, { timestamps: true });
  
  module.exports = Order;