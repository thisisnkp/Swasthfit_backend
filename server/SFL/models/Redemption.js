const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Redemption = sequelize.define(
  "Redemption",
  {
    redemption_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    reward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rewards",
        key: "id",
      },
    },
    purchase_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    coins_earned: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_category: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "redemptions",
    timestamps: true,
    underscored: false,
  }
);

module.exports = Redemption;
