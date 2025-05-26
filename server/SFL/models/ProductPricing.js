const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const ProductPricing = sequelize.define(
  "ProductPricing",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mrp: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    business_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_margin_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 50.0, // 50% of purchase price
    },
    swaasthfiit_margin_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 50.0, // 50% of reward margin
    },
    gullak_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 90.0, // 90% of coin savings
    },
  },
  {
    tableName: "product_pricing",
  }
);

module.exports = ProductPricing;
