
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../../sequelize');
const FoodItemOffers = require("../models/ItemOffer");
const FoodRestaurant = require("../models/Restaurant");
const FoodOrders = require("../models/foodOrder")
class FoodItem extends Model {}

// FoodItem.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     restaurant_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         references: {
//             model: 'FoodRestaurants', // Make sure this is the correct table name
//             key: 'id'
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE'
//     },
    
//     category_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//             model: 'FoodCategories',
//             key: 'id'
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'SET NULL'
//     },
//     menu_name: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     description: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     menu_img: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     status: {
//         type: DataTypes.STRING,
//         defaultValue: 'active'
//     },
//     total_quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: true
//     },
//     price: {
//         type: DataTypes.FLOAT,
//         allowNull: true
//     },
//     is_veg: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     is_recommended: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     },
//     rating: {
//         type: DataTypes.FLOAT,   
//         allowNull: true,
//         defaultValue: 0.0
//     },
//     distance: {
//         type: DataTypes.FLOAT,   
//         allowNull: true
//     },
   
//     created_by: {
//         type: DataTypes.STRING,
//         allowNull: true,
//     }, 
//      ingredients: {
//         type: DataTypes.STRING,  // Store ingredients as comma-separated string
//         allowNull: true,
//         comment: "Comma-separated ingredients e.g. rice, jeera, tomato"
//     },
//     cuisine_type: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         comment: "Cuisine type e.g. Indian, Chinese, Italian"
//     },
// }, {
//     sequelize,
//     modelName: 'FoodItem',
//     tableName: 'fooditems',
//     underscored: true,
//     timestamps: true
// });



//  Define One-to-Many Relationship
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

FoodItem.hasMany(FoodItemOffers, { foreignKey: "item_id", as: "offers", onDelete: "CASCADE" });
FoodItemOffers.belongsTo(FoodItem, { foreignKey: "item_id", as: "foodItem", onDelete: "CASCADE" });


// Many-to-One: A food item belongs to one restaurant
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


  
module.exports = FoodItem;
