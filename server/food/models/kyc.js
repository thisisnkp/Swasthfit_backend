"use strict";
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize"); // Adjust the path to your Sequelize instance

class KYC extends Model {
  static associate(models) {
    // Here we can define the relationships with other models (e.g., User)
    KYC.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user', // If each KYC is linked to a user
    });
    KYC.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'restaurant', // If each KYC is linked to a restaurant
      });
  }
}

KYC.init({
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  restaurant_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,  // Ensure this field is not nullable
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_holder_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  account_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ifsc_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pan_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pan_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  full_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gst_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  msme_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shop_certificate_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cheque: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gst_certificate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  msme_certificate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shop_certificate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  additional_docs: {
    type: DataTypes.JSONB, // To store multiple document URLs
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'KYC',
  tableName: 'kyc_details',
  underscored: true, // If you want to use snake_case column names
  timestamps: true,  // Automatically create createdAt, updatedAt columns
});

module.exports = KYC;
