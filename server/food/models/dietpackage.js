<<<<<<< HEAD
// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../../../sequelize");
// const FoodRestaurant = require("../models/Restaurant");
// class DietPackage extends Model {}

// DietPackage.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     img: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     breakfast: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     lunch: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     dinner: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     combo: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     breakfast_price: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     lunch_price: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     dinner_price: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     combo_price: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     latitude: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     longitude: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "DietPackage",
//     tableName: "diet_packages",
//     timestamps: false,
//     hooks: {
//       afterCreate: async (dietPackage, options) => {
//         try {
//           const restaurants = await FoodRestaurant.findAll();

//           const foodRestaurantEntries = restaurants.map((restaurant) => ({
//             diet_pack_id: dietPackage.id,
//             restaurant_id: restaurant.id,
//           }));

//           await FoodRestaurant.bulkCreate(foodRestaurantEntries);
//           // console.log("Diet package added to all restaurants!");
//         } catch (error) {
//           console.error("Error adding diet package to restaurants:", error);
//         }
//       },
//     },
//   },
// );

// module.exports = DietPackage;
=======

>>>>>>> restaurent_backend
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
        model: 'FoodRestaurant', // The table name of the associated model
        key: 'id', // The primary key of FoodRestaurant
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
<<<<<<< HEAD
    // hooks: {
    //   afterCreate: async (dietPackage, options) => {
    //     try {
    //       const dietLat = dietPackage.latitude;
    //       const dietLng = dietPackage.longitude;
    
    //       if (!dietLat || !dietLng) {
    //         console.error("Diet package is missing latitude or longitude");
    //         return;
    //       }
    
    //       const toRad = (value) => (value * Math.PI) / 180;
    //       const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
    //         const R = 6371; // Radius of Earth in km
    //         const dLat = toRad(lat2 - lat1);
    //         const dLon = toRad(lon2 - lon1);
    //         const a =
    //           Math.sin(dLat / 2) ** 2 +
    //           Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    //         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //         return R * c; // Distance in kilometers
    //       };
    
    //       // Fetch all restaurants
    //       const allRestaurants = await FoodRestaurant.findAll({
    //         attributes: ['id', 'latitude', 'longitude'],
    //       });
    
    //       console.log(`Found ${allRestaurants.length} restaurants.`);
    
    //       // Adjust the filter to allow proximity range (2 to 5 km)
    //       const nearbyRestaurants = allRestaurants.filter((restaurant) => {
    //         const dist = getDistanceInKm(
    //           dietLat,
    //           dietLng,
    //           restaurant.latitude,
    //           restaurant.longitude
    //         );
    //         return dist >= 2 && dist <= 5; // You can adjust this range (2 km to 5 km)
    //       });
    
    //       console.log(`Found ${nearbyRestaurants.length} nearby restaurants.`);
    
    //       if (nearbyRestaurants.length === 0) {
    //         console.log("No nearby restaurants found within the specified range.");
    //         return;
    //       }
    
    //       // Prepare data for inserting links
    //       const newRestaurantRecords = nearbyRestaurants.map((restaurant) => ({
    //         diet_pack_id: dietPackage.id,
    //         restaurant_id: restaurant.id,
    //       }));
    
    //       console.log("Prepared data for bulk insert:", newRestaurantRecords);
    
    //       // Bulk insert to link diet package to the nearby restaurants
    //       await FoodRestaurant.bulkCreate(newRestaurantRecords);
    
    //       console.log("Nearby restaurants successfully linked to the diet package.");
    //     } catch (error) {
    //       console.error("Error linking diet package to nearby restaurants:", error);
    //     }
    //   },
    // }
=======

>>>>>>> restaurent_backend
    hooks: {
      afterCreate: async (dietPackage, options) => {
        try {
          const dietLat = dietPackage.latitude;
          const dietLng = dietPackage.longitude;

          const toRad = (value) => (value * Math.PI) / 180;
          const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // Radius of the Earth in km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
              Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in km
          };

          // Fetch all restaurants and calculate distance
          const allRestaurants = await FoodRestaurant.findAll({
            attributes: ['id','latitude', 'longitude'], // Get relevant data
          });

          // Filter nearby restaurants (within the 5 km range, for example)
          const nearbyRestaurants = allRestaurants.filter((restaurant) => {
            const dist = getDistanceInKm(
              dietLat,
              dietLng,
              restaurant.latitude,
              restaurant.longitude
            );
            return dist >= 2 && dist <= 5; // Restaurants within 2-5 km
          });

          // Update each nearby restaurant with the new diet package ID
          for (const restaurant of nearbyRestaurants) {
            // Send message or update the restaurant (e.g., add a diet package ID or a message)
            await restaurant.update({
              diet_pack_id: dietPackage.id, // You can add other updates like notifications, etc.
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
