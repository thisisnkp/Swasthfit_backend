const { DataTypes } = require('sequelize');
const sequelize = require("../../../sequelize");

const CampaignAnalysis = sequelize.define('CampaignStat', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  campaign_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  click: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reach: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  conversion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'campaign_analysis',
  timestamps: false,
  underscored: true,
});

module.exports = CampaignAnalysis;
