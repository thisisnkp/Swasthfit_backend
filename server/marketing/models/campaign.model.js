
const { DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  billing_country: {
    type: DataTypes.ENUM(
      'India', 'United States', 'United Kingdom', 'Australia', 'Canada',
      'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Singapore',
      'United Arab Emirates', 'New Zealand', 'Japan', 'China', 'Brazil',
      'South Africa', 'Russia', 'Mexico', 'Other'
    ),
    allowNull: false,
  },
  timezone: {
    type: DataTypes.ENUM(
      'Coordinated Universal Time (UTC)', 'Indian Standard Time (IST)',
      'Pacific Standard Time (PST)', 'Eastern Standard Time (EST)',
      'Central Standard Time (CST)', 'Mountain Standard Time (MST)',
      'Greenwich Mean Time (GMT)', 'Central European Time (CET)',
      'Eastern European Time (EET)', 'Japan Standard Time (JST)',
      'Australian Eastern Standard Time (AEST)',
      'New Zealand Standard Time (NZST)', 'Other'
    ),
    allowNull: false,
  },
  currency: {
    type: DataTypes.ENUM(
      'Indian Rupee (INR)', 'US Dollar (USD)', 'Euro (EUR)', 'British Pound (GBP)',
      'Australian Dollar (AUD)', 'Canadian Dollar (CAD)', 'Singapore Dollar (SGD)',
      'Japanese Yen (JPY)', 'Chinese Yuan (CNY)', 'South African Rand (ZAR)',
      'Brazilian Real (BRL)', 'Russian Ruble (RUB)', 'Mexican Peso (MXN)', 'Other'
    ),
    allowNull: false,
  },
  offer_code: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  payment_mode: {
    type: DataTypes.ENUM('Online', 'Offline', 'Cash on Delivery', 'Wallet'),
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM(
      'Razorpay', 'Stripe', 'PayPal', 'Google Pay', 'Apple Pay',
      'Bank Transfer', 'Cash', 'Other'
    ),
    allowNull: false,
  },

  country_code: {
    type: DataTypes.ENUM(
      'India (+91)', 'United States (+1)', 'United Kingdom (+44)', 'Australia (+61)',
      'Japan (+81)', 'Singapore (+65)', 'United Arab Emirates (+971)', 'Germany (+49)',
      'France (+33)', 'China (+86)', 'Brazil (+55)', 'Russia (+7)', 'Mexico (+52)', 'Other'
    ),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  radius: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  module_type: {
    type: DataTypes.ENUM('ecom', 'gym', 'restorant'),
    allowNull: false, 
    defaultValue: 'ecom' 
  }


}, {
  tableName: 'campaign_details',
  timestamps: false,
});

module.exports = Campaign;
