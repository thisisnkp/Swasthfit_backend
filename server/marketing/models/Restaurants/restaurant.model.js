const { DataTypes } = require('sequelize');
const sequelize = require('../../../../sequelize'); 

const Vendor = sequelize.define('Vendor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  rimg: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  status: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 1,
  },
  full_address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  landmark: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  store_charge: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  bank_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  ifsc: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  receipt_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  acc_number: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rest_status: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  sdesc: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  pan_no: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  gst_no: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  fssai_no: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  aadhar_no: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  aadhar_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_popular: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  is_fitmode: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  is_dietpkg: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  is_dining: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  is_recommended: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  diet_pack_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'foodrestaurants',
  timestamps: false,
  underscored: true,
});

module.exports = Vendor;
