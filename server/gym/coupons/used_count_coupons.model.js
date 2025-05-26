const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const DiscountCoupon = sequelize.define(
  "DiscountCoupon",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    coupon_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    module_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: "coupons_used_by",
    timestamps: false,
  }
);

module.exports = DiscountCoupon;
