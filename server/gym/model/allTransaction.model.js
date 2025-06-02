const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const VendorTransaction = sequelize.define(
  "VendorTransaction",
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
    vendor_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("pay in", "pay out"),
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    for: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "all_transactions",
    timestamps: false,
  }
);

module.exports = VendorTransaction;
