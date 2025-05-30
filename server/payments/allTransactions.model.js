const { DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");

const AllTransactions = sequelize.define(
  "all_transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vendor_type: {
      type: DataTypes.ENUM("gym", "trainer"),
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("pay in", "pay out"),
      allowNull: false,
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    for: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "all_transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = AllTransactions;
