const { DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize'); 

const VendorInfo = sequelize.define('VendorInfo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  businessName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  businessEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  PAN: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  GST: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  products: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  vendorType: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'restvendors',
  timestamps: false,
  underscored: true,
});

module.exports = VendorInfo;
