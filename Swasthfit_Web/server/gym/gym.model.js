'use strict';
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const User = require('../user/user.model');

const Gym = sequelize.define(
  'gym',
  {
    gym_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    gym_name: DataTypes.STRING,
    owner_name: DataTypes.STRING,
    alternate_mobile: DataTypes.STRING,
    email_id: DataTypes.STRING,
    address: DataTypes.TEXT,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    gym_logo: DataTypes.STRING,
    profile_photo: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    account_holder_name: DataTypes.STRING,
    account_number: DataTypes.STRING,
    ifsc_code: DataTypes.STRING,
    cancel_cheque_photo: DataTypes.STRING,
    pancard_name: DataTypes.STRING,
    pancard_number: DataTypes.STRING,
    gst_number: DataTypes.STRING,
    gst_photo: DataTypes.STRING,
    msme_certificate_number: DataTypes.STRING,
    msme_certificate_photo: DataTypes.STRING,
    shop_certificate: DataTypes.STRING,
    shop_certificate_photo: DataTypes.STRING,
    workout_type: DataTypes.JSON,
    closing_date: DataTypes.STRING,
    facilities: DataTypes.JSON,
    about_us: DataTypes.TEXT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  },
  {
    sequelize,
    modelName: 'Gym',
    tableName: 'gyms',
    underscored: true
  });

Gym.associate = (models) => {
  Gym.belongsTo(models.User, {
    foreignKey: 'user_id',
  });
};

Gym.addHook('afterFind', (result, options) => {
  const fieldsToDeserialize = ['workout_type', 'facilities'];
  if (result) {
    if (Array.isArray(result)) {
      result.forEach(instance => {
        fieldsToDeserialize.forEach(field => {
          if (instance[field] && typeof instance[field] === 'string') {
            try {
              instance[field] = JSON.parse(instance[field]);
            } catch (err) {
              console.error(`Error deserializing field "${field}":`, err);
            }
          }
        });
      });
    } else {
      fieldsToDeserialize.forEach(field => {
        if (result[field] && typeof result[field] === 'string') {
          try {
            result[field] = JSON.parse(result[field]);
          } catch (err) {
            console.error(`Error deserializing field "${field}":`, err);
          }
        }
      });
    }
  }
});

// User.associate({ Gym });
module.exports = Gym;
