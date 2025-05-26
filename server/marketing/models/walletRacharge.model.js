const { DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

const VendorWalletPayments = sequelize.define('VendorPayment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  module_type: {
    type: DataTypes.ENUM('e-com', 'gym', 'restaurant'), // fixed typo from 'res'
    allowNull: false,
  },
  recharge_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  payment_mode: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  billing_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  business_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gst: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'vendor_wallet_payments',
  timestamps: false,
  underscored: true,
});

module.exports = VendorWalletPayments;
