const { DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize'); 
const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  page: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  from: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  to: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  bid_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'bid_info',
  timestamps: false,  
  underscored: true,  
});

module.exports = Bid;