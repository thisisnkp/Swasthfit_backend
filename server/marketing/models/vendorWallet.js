const { DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize'); 

const VendorWallet = sequelize.define('VendorWallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  walletAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  module_type: {
    type: DataTypes.ENUM('ecom', 'restaurant', 'gym'),
    allowNull: false
  }
}, {
  tableName: 'vendor_wallet',
  timestamps: false
});

module.exports = VendorWallet;
