const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../../sequelize");

const WalletTransaction = sequelize.define(
  "WalletTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reach: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    click: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    conversion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_DATE"),
    },
    module_type: {
      type: DataTypes.ENUM("ecom", "gym", "restaurant"),
      allowNull: true,
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  },
  {
    tableName: "market_wallet_transaction",
    timestamps: false, // manually managing timestamps
    underscored: true,
  }
);

module.exports = WalletTransaction;
