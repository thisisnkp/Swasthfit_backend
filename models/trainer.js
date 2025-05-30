'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trainer.init({
    profilePhoto: DataTypes.STRING,
    transformationPhoto: DataTypes.TEXT,
    name: DataTypes.STRING,
    expertise: DataTypes.STRING,
    experience: DataTypes.STRING,
    address: DataTypes.STRING,
    bank: DataTypes.TEXT,
    timeSlot: DataTypes.TEXT,
    miscellaneous: DataTypes.TEXT,
    wallet_id: {
      type: DataTypes.STRING(5),
      unique: true,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Trainer',
  });
  return Trainer;
};
