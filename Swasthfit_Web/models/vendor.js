'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Vendor.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    businessName: DataTypes.STRING,
    businessEmail: DataTypes.STRING,
    PAN: DataTypes.STRING,
    GST: DataTypes.STRING,
    products: DataTypes.TEXT,
    sellingOnAmazon: DataTypes.BOOLEAN,
    sellingOnFlipkart: DataTypes.BOOLEAN,
    otherPlatforms: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Vendor',
  });
  return Vendor;
};