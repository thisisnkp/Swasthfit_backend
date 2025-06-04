const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const FoodRestaurant = require("../models/Restaurant");

class DietPackage extends Model {}

DietPackage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'FoodRestaurant',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    breakfast: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lunch: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dinner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    combo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    breakfast_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lunch_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dinner_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    combo_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "DietPackage",
    tableName: "diet_packages",
    timestamps: false,
    hooks: {
      afterCreate: async (dietPackage, options) => {
        try {
          const dietLat = dietPackage.latitude;
          const dietLng = dietPackage.longitude;

          const toRad = (value) => (value * Math.PI) / 180;
          const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          const allRestaurants = await FoodRestaurant.findAll({
            attributes: ['id','latitude', 'longitude'],
          });

          const nearbyRestaurants = allRestaurants.filter((restaurant) => {
            const dist = getDistanceInKm(
              dietLat,
              dietLng,
              restaurant.latitude,
              restaurant.longitude
            );
            return dist >= 2 && dist <= 5;
          });

          for (const restaurant of nearbyRestaurants) {
            await restaurant.update({
              diet_pack_id: dietPackage.id,
            });
            console.log(`Diet package linked to restaurant: ${restaurant.name}`);
          }

          console.log('Diet package added to nearby restaurants successfully.');
        } catch (error) {
          console.error("Error linking diet package to nearby restaurants:", error);
        }
      },
    },
  }
);

module.exports = DietPackage;
