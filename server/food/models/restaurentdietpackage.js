<<<<<<< HEAD
// // const { Model, DataTypes } = require("sequelize");
// // const sequelize = require("../../../sequelize");
// // const FoodRestaurant = require("../models/Restaurant");
// // const DietPackage = require("../models/dietpackage");
// // const ClientDietPlan = require("./clientdietplan");

// // class RestaurantDietPackage extends Model {}

// // RestaurantDietPackage.init(
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       autoIncrement: true,
// //       primaryKey: true,
// //     },
// //     restaurant_id: {
// //       type: DataTypes.INTEGER,
// //       references: {
// //         model: FoodRestaurant, // The associated restaurant model
// //         key: 'id', // The key that links to the restaurant model
// //       },
// //     },
// //     diet_plan_id: {
// //       type: DataTypes.INTEGER,
// //       references: {
// //         model: ClientDietPlan, // The associated diet package model
// //         key: 'id', // The key that links to the diet package model
// //       },
// //     },
// //     status: {
// //       type: DataTypes.ENUM("pending", "accepted", "rejected"),
// //       defaultValue: "pending", // Default status is 'pending'
// //     },
// //     breakfast_price: {
// //       type: DataTypes.FLOAT,
// //       allowNull: true,
// //     },
// //     lunch_price: {
// //       type: DataTypes.FLOAT,
// //       allowNull: true,
// //     },
// //     dinner_price: {
// //       type: DataTypes.FLOAT,
// //       allowNull: true,
// //     },
// //     combo_price: {
// //       type: DataTypes.FLOAT,
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     sequelize,
// //     modelName: "RestaurantDietPackage",
// //     tableName: "restaurant_diet_packages",
// //     timestamps: false,
// //   }
// // );

// // module.exports = RestaurantDietPackage;
// const { Model, DataTypes } = require("sequelize");
// const sequelize = require("../../../sequelize");
// const FoodRestaurant = require("../restaurant/foodRestaurant.model");
// const ClientDietPlan = require("../dietplan/clientDietPlan.model");

// class RestaurantDietPlan extends Model {}

// RestaurantDietPlan.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     client_diet_plan_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     restaurant_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
  
//     breakfast_price: DataTypes.FLOAT,
//     lunch_price: DataTypes.FLOAT,
//     dinner_price: DataTypes.FLOAT,
//     snacks_price: DataTypes.FLOAT,
//     combo_price: DataTypes.FLOAT,
//     optional_item_price: DataTypes.FLOAT,
//     status: {
//       type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
//       defaultValue: "Pending",
//     },
//     remark: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     modelName: "RestaurantDietPlan",
//     tableName: "restaurant_diet_plans",
//     underscored: true,
//     timestamps: true,
//   }
// );

// // Associations
// RestaurantDietPlan.belongsTo(FoodRestaurant, {
//   foreignKey: "restaurant_id",
//   as: "restaurant",
// });
// RestaurantDietPlan.belongsTo(ClientDietPlan, {
//   foreignKey: "client_diet_plan_id",
//   as: "dietPlan",
// });

// module.exports = RestaurantDietPlan;
=======

>>>>>>> restaurent_backend
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const ClientDietPlan = require("../models/clientdietplan");
const FoodRestaurant = require("../models/Restaurant");
class RestaurantDietPlan extends Model {}

RestaurantDietPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_diet_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ClientDietPlan,  // references ClientDietPlan model
        key: 'id',  // references 'id' in ClientDietPlan
      },
      onDelete: 'CASCADE',
    },
    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    breakfast_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FoodRestaurant,  // references ClientDietPlan model
        key: 'id',  // references 'id' in ClientDietPlan
      },
      onDelete: 'CASCADE',
    },
    lunch_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dinner_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    snacks_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    combo_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    optional_item_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      allowNull: true,
      defaultValue: "Pending",
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "ClientDietPlanRestaurant",
    tableName: "restaurant_diet_plans",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
module.exports = RestaurantDietPlan;