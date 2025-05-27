
const sequelize = require('../../../sequelize'); // or './sequelize' depending on path

// Import models
const DietPackage = require('./dietpackage');
const FoodRestaurant = require('./Restaurant');
const FoodOrders = require('./foodOrder');
const FoodItem = require('./FoodItem');
const Vendor = require("./Vendor");
const User = require("../../user/user.model");
const UserProductAction = require("./userproductaction");
const ClientDietPlan = require("./clientdietplan");
// const ClientWorkout = require('./ClientWorkout');
const RestaurantDietPackage = require("./restaurentdietpackage");

// ===================== Associations ===================== //

// FoodRestaurant ↔ DietPackage association
// One restaurant can have many diet packages
FoodRestaurant.hasMany(DietPackage, {
  foreignKey: "restaurant_id",
  as: "dietPackage", // Use plural name for clarity
});

// Each diet package belongs to one restaurant
DietPackage.belongsTo(FoodRestaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// Define relationships (Associations)
FoodRestaurant.hasMany(User, { foreignKey: 'restaurant_id', as: 'users' }); // One-to-many relationship
User.belongsTo(FoodRestaurant, { foreignKey: 'restaurant_id', as: 'restaurant' }); // Many-to-one relationship

// In your models/user.js file
User.belongsTo(FoodRestaurant, {
  foreignKey: 'restaurant_id',
  onDelete: 'SET NULL',
});

// In your models/foodRestaurant.js file
FoodRestaurant.hasMany(User, {
  foreignKey: 'restaurant_id',
});

// FoodRestaurant ↔ FoodOrders
FoodRestaurant.hasMany(FoodOrders, {
  foreignKey: 'restaurant_id',
  as: 'orders',
  onDelete: 'CASCADE',
});
FoodOrders.belongsTo(FoodRestaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant',
});

// ✅ Association
// Association: UserProductAction belongs to User
UserProductAction.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Association: User has many UserProductActions
User.hasMany(UserProductAction, {
  foreignKey: 'user_id',
  as: 'actions',
});

// Association: UserProductAction belongs to FoodItem
UserProductAction.belongsTo(FoodItem, {
  foreignKey: 'product_id',
  as: 'food_item',
});

// Association: FoodItem has many UserProductActions
FoodItem.hasMany(UserProductAction, {
  foreignKey: 'product_id',
  as: 'actions',
});

// Inside your model/index.js
Vendor.hasMany(FoodRestaurant, { foreignKey: "vendor_id", as: "restaurants" });
FoodRestaurant.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });

// Define associations AFTER models are loaded
User.hasMany(UserProductAction, { foreignKey: 'user_id' });
FoodItem.hasMany(UserProductAction, { foreignKey: 'product_id' });
UserProductAction.belongsTo(User, { foreignKey: 'user_id' });
UserProductAction.belongsTo(FoodItem, { foreignKey: 'product_id' });

// Associations
User.hasMany(ClientDietPlan, { foreignKey: "user_id" });
ClientDietPlan.belongsTo(User, { foreignKey: "user_id" });

// RestaurantDietPackage ↔ ClientDietPlan (Many-to-One relationship)
RestaurantDietPackage.belongsTo(ClientDietPlan, {
  foreignKey: "client_diet_plan_id",
  as: "dietPlan",
});

// RestaurantDietPackage ↔ FoodRestaurant (Many-to-One relationship)
RestaurantDietPackage.belongsTo(FoodRestaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

// Reverse associations for ClientDietPlan ↔ RestaurantDietPackage
ClientDietPlan.hasMany(RestaurantDietPackage, {
  foreignKey: "client_diet_plan_id",
  as: "restaurantPlans",
});

// Reverse associations for FoodRestaurant ↔ RestaurantDietPackage
FoodRestaurant.hasMany(RestaurantDietPackage, {
  foreignKey: "restaurant_id",
  as: "dietPlanPackages",
});

// Restaurant ↔ DietPackage association (Many-to-Many via RestaurantDietPackage)
FoodRestaurant.belongsToMany(DietPackage, {
  through: RestaurantDietPackage,
  foreignKey: "restaurant_id",
  otherKey: "client_diet_plan_id",
  as: "availableDietPlans", // Updated alias for this association
});
// Define the many-to-many relationship between FoodRestaurant and DietPackage through RestaurantDietPackage
FoodRestaurant.belongsToMany(DietPackage, {
  through: RestaurantDietPackage,
  foreignKey: 'restaurant_id',
  otherKey: 'client_diet_plan_id',
  as: 'dietPlans',
});

// DietPlan ↔ Restaurant association (Many-to-Many via RestaurantDietPackage)
DietPackage.belongsToMany(FoodRestaurant, {
  through: RestaurantDietPackage,
  foreignKey: "client_diet_plan_id",
  otherKey: "restaurant_id",
  as: "restaurantsOfferingDietPlan", // Updated alias for this association
});
// Define the many-to-many relationship between DietPackage and FoodRestaurant through RestaurantDietPackage
DietPackage.belongsToMany(FoodRestaurant, {
  through: RestaurantDietPackage,
  foreignKey: 'client_diet_plan_id',
  otherKey: 'restaurant_id',
  as: 'restaurants',
});

User.hasMany(FoodOrders, {
  foreignKey: 'user_id',
  as: 'foodOrders',  // 👈 Changed alias to be unique
});

FoodOrders.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});


// Association
User.hasOne(Vendor, { foreignKey: "user_id", as: "vendor" });
Vendor.belongsTo(User, { foreignKey: "user_id", as: "user" });

// ===================== Export ===================== //

module.exports = {
  sequelize,
  User,
  // ClientWorkout,
  ClientDietPlan,
  UserProductAction,
  DietPackage,
  FoodRestaurant,
  FoodOrders,
  FoodItem,
  Vendor
};
