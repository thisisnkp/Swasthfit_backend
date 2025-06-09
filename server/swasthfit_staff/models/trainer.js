'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trainer extends Model {
    static associate(models) {
      // define association here
    }
  }
  Trainer.init(
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      expertise: DataTypes.STRING,
      experience: DataTypes.STRING,
      address: DataTypes.STRING,
      bank_account_no: DataTypes.STRING,
      ifsc_code: DataTypes.STRING,
      days: DataTypes.TEXT,
      time_slot: DataTypes.TEXT,
      trainerType: DataTypes.STRING,
      client_bio: DataTypes.TEXT,
      client_price: DataTypes.STRING,
      client_quote: DataTypes.STRING,
      diet_and_workout_details: DataTypes.TEXT,
      profile_photo: DataTypes.STRING,
      transformation_photos: DataTypes.TEXT,
      aadhar_details: DataTypes.STRING,
      pan_details: DataTypes.STRING,
      commission_earned: DataTypes.INTEGER,
      ratings: DataTypes.INTEGER,
      wallet_id: {
        type: DataTypes.STRING(5),
        unique: true,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Trainer',
      tableName: 'trainers',
      timestamps: false,
    }
  );
  return Trainer;
};
