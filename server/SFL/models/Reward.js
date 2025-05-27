const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Reward = sequelize.define(
  "Reward",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    business_category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_type: {
      type: DataTypes.ENUM("double", "triple", "fixed"),
      allowNull: false,
    },
    min_purchase_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    max_reward_coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "rewards",
    timestamps: true,
    underscored: false, // This ensures createdAt and updatedAt columns are used
  }
);

module.exports = Reward;
