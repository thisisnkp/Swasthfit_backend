const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const PurchaseReward = sequelize.define(
  "PurchaseReward",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    business_category: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    reward_type: {
      type: DataTypes.ENUM("double", "triple"),
      allowNull: false,
      defaultValue: "double",
    },
  },
  {
    tableName: "purchase_rewards",
  }
);

module.exports = PurchaseReward;
