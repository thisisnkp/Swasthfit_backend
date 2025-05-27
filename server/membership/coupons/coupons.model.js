const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust the path if needed

const Coupon = sequelize.define("Coupon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  min_purchase_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  offer_type: {
    type: DataTypes.ENUM("Percentage", "Fixed"),
    allowNull: false,
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  max_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expired_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  apply_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Active", "Inactive"),
    defaultValue: "Active",
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, 
  tableName: "coupons",
});

module.exports = Coupon;
