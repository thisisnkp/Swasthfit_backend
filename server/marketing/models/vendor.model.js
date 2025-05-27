// vendor.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Vendor = sequelize.define("Vendor", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
  },
  banner_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shop_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slug: {
    type: DataTypes.STRING(191),
    allowNull: false,
  },
  open_at: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  closed_at: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seo_title: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  seo_description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_featured: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  top_rated: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  verified_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  greeting_msg: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "vendors",
  timestamps: false,
});

module.exports = Vendor;
