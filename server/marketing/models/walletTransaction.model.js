const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require("../../../sequelize");

const WalletTransaction = sequelize.define('WalletTransaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  click: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  conversion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  }
}, {
  tableName: 'market_wallet_transaction',
  timestamps: false,
  underscored: true,
});


module.exports = WalletTransaction;