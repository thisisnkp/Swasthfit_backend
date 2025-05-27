const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const SocialActivity = sequelize.define(
  "SocialActivity",
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
    activity_type: {
      type: DataTypes.ENUM(
        "share",
        "like",
        "comment",
        "brain_game",
        "referral",
        "product_share"
      ),
      allowNull: false,
    },
    content_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coins_earned: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    purchase_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "social_activities",
    timestamps: true,
  }
);

module.exports = SocialActivity;
