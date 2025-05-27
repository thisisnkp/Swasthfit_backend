const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Import sequelize instance

class AdminDetails extends Model {}

AdminDetails.init(
  {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerName1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerName2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternateMobileNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    RestaurentLogo: {
      type: DataTypes.STRING,  // Store image URL/path
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING,  // Store image URL/path
      allowNull: true,
    },
    aadharFrontImage: {
      type: DataTypes.STRING,  // Store image URL/path
      allowNull: true,
    },
    aadharBackImage: {
      type: DataTypes.STRING,  // Store image URL/path
      allowNull: true,
    },
    panImage: {
      type: DataTypes.STRING,  // Store image URL/path
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AdminDetails',
    tableName: 'admin_details',
    timestamps: true,
  }
);

module.exports = AdminDetails;
