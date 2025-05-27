const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const CoinBid = sequelize.define(
  "CoinBid",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    coin_seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "CoinSellers",
        key: "id",
      },
    },
    bidder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bid_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    bid_status: {
      type: DataTypes.ENUM("pending", "won", "rejected"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "coin_bids", // Specify the correct table name
    timestamps: false, // Disable timestamps if not needed
  }
);

module.exports = CoinBid;
