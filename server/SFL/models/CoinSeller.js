const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const CoinSeller = sequelize.define(
  "CoinSeller",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    competition_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    time_limit_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 3,
      },
    },
    status: {
      type: DataTypes.ENUM("open", "sold", "expired"),
      defaultValue: "open",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "coin_sellers", // Specify the correct table name
    timestamps: false, // Disable timestamps if not needed
  }
);

module.exports = CoinSeller;
