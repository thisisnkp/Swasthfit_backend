const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Coupon = sequelize.define(
  "Coupon",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    module_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount_type: {
      type: DataTypes.ENUM("Percentage", "Fixed"),
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    valid_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    apply_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    apply_quantity_type: {
      type: DataTypes.ENUM("limited", "unlimited"),
      defaultValue: "limited",
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "expired"),
      defaultValue: "active",
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "discount_coupons",
  }
);

module.exports = Coupon;
