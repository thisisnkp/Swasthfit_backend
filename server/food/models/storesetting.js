const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize'); // apne DB connection path ke hisaab se adjust karen

class RestaurantSettings extends Model {}

RestaurantSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
       restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,  
      references: {
        model: 'foodrestaurants', 
        key: 'id',
      },
    },
    restaurant_logo: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    restaurant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_phone_number: {
      type: DataTypes.STRING(10), 
      allowNull: false,
    },
    alternate_phone_number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    owner_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    full_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    opening_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    meta_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meta_tag_keyword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    facebook_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    instagram_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    twitter_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    // Assuming latitude and longitude will be saved as floats
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'RestaurantSettings',
    tableName: 'restaurant_settings', 
    timestamps: true,
  }
);

module.exports = RestaurantSettings;
