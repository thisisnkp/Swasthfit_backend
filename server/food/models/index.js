const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');

// Models
const FoodItemOffers = require("../models/ItemOffer");
const FoodRestaurant = require("../models/Restaurant");
const FoodOrders = require("../models/foodOrder");
const DietPackage = require("./dietpackage");
const Vendor = require("./Vendor");
const User = require("../../user/user.model");
const UserProductAction = require("./userproductaction");
const ClientDietPlan = require("./clientdietplan");
const RestaurantDietPackage = require("./restaurentdietpackage");
const RestaurantSettings = require("./storesetting");
const Rider = require("./rider");
const Invoice = require("./invoice");
const InvoiceItem = require("./InvoiceItem");

class FoodItem extends Model {}

FoodItem.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'FoodRestaurants',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'FoodCategories',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    menu_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    menu_img: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
        comment: "Discount in percentage"
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "e.g. Plate, Bowl, Piece"
    },
    cost_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "Backend purchase cost"
    },
    calories: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "Calories in kcal"
    },
    diet_type: {
        type: DataTypes.ENUM('veg', 'non_veg', 'vegan', 'eggetarian'),
        allowNull: false,
        defaultValue: 'veg'
    },
    variants: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Comma-separated variants e.g. Small, Medium, Large"
    },
    addons: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Comma-separated addons e.g. Extra Cheese, Gravy"
    },
    spice_level: {
        type: DataTypes.ENUM('none', 'mild', 'medium', 'hot'),
        allowNull: false,
        defaultValue: 'none'
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Comma-separated tags e.g. Bestseller, Kids"
    },
    prep_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Preparation time in minutes"
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: "Availability: true = Available, false = Not Available"
    },
    is_recommended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ingredients: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Comma-separated ingredients e.g. rice, jeera, tomato"
    },
    cuisine_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Cuisine type e.g. Indian, Chinese"
    },
}, {
    sequelize,
    modelName: 'FoodItem',
    tableName: 'fooditems',
    underscored: true,
    timestamps: true
});

// ===================== Associations ===================== //

FoodItem.hasMany(FoodItemOffers, { foreignKey: "item_id", as: "offers", onDelete: "CASCADE" });
FoodItemOffers.belongsTo(FoodItem, { foreignKey: "item_id", as: "foodItem", onDelete: "CASCADE" });

FoodItem.belongsTo(FoodRestaurant, {
    foreignKey: 'restaurant_id',
    as: 'restaurant',
    onDelete: 'CASCADE'
});
FoodRestaurant.hasMany(FoodItem, {
    foreignKey: 'restaurant_id',
    as: 'foodItems',
    onDelete: 'CASCADE'
});

RestaurantDietPackage.belongsTo(FoodRestaurant, { foreignKey: "restaurant_id", as: "restaurant" });
ClientDietPlan.hasMany(RestaurantDietPackage, { foreignKey: "client_diet_plan_id", as: "restaurantPlans" });
FoodRestaurant.hasMany(RestaurantDietPackage, { foreignKey: "restaurant_id", as: "dietPlanPackages" });

FoodRestaurant.belongsToMany(DietPackage, {
    through: RestaurantDietPackage,
    foreignKey: "restaurant_id",
    otherKey: "client_diet_plan_id",
    as: "availableDietPlans"
});
FoodRestaurant.belongsToMany(DietPackage, {
    through: RestaurantDietPackage,
    foreignKey: 'restaurant_id',
    otherKey: 'client_diet_plan_id',
    as: 'dietPlans'
});
DietPackage.belongsToMany(FoodRestaurant, {
    through: RestaurantDietPackage,
    foreignKey: "client_diet_plan_id",
    otherKey: "restaurant_id",
    as: "restaurantsOfferingDietPlan"
});
DietPackage.belongsToMany(FoodRestaurant, {
    through: RestaurantDietPackage,
    foreignKey: 'client_diet_plan_id',
    otherKey: 'restaurant_id',
    as: 'restaurants'
});

User.hasMany(FoodOrders, { foreignKey: 'user_id', as: 'foodOrders' });
FoodOrders.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(Vendor, { foreignKey: "user_id", as: "vendor" });
Vendor.belongsTo(User, { foreignKey: "user_id", as: "user" });

FoodRestaurant.hasOne(RestaurantSettings, { foreignKey: 'restaurant_id', as: 'settings', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
RestaurantSettings.belongsTo(FoodRestaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });

FoodOrders.belongsTo(Rider, { foreignKey: 'rider_id', as: 'rider' });
Rider.hasMany(FoodOrders, { foreignKey: 'rider_id', as: 'orders' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', sourceKey: 'invoice_id', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id', targetKey: 'invoice_id' });

// ===================== Export ===================== //

module.exports = {
  sequelize,
  User,
  ClientDietPlan,
  UserProductAction,
  DietPackage,
  FoodRestaurant,
  FoodOrders,
  FoodItem,
  Vendor,
  Invoice,
  InvoiceItem
};
