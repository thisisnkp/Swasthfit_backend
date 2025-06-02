
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../../sequelize");
const User = require("../../user/user.model");

class ClientDietPlan extends Model {}
ClientDietPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meal_type: {
      type: DataTypes.ENUM("Breakfast", "Lunch", "Snacks", "Dinner", "Water"),
      allowNull: false,
    },
    food_item_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity_unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fats: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    protein: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    carbs: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    food_type: {
      type: DataTypes.ENUM("Compulsory", "Optional"),
<<<<<<< HEAD
       defaultValue: "Compulsory", //function() {
      //   // Make snacks optional by default
      //   return this.meal_type === "Snacks" ? "Optional" : "Compulsory";
      // },
=======
       defaultValue: "Compulsory", 
     
>>>>>>> restaurent_backend
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    water_intake: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    water_intake_unit: {
      type: DataTypes.STRING,
      defaultValue: "ML",
      allowNull: true,
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
    snacks_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    combo_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    discount_type: {
      type: DataTypes.ENUM("Fixed", "Percentage"),
      allowNull: true,
    },
    discount_value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    plan_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    optional_item_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    optional_item_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    meal_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "For ordering multiple items within the same meal type"
    },
    is_water_intake: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: "ClientDietPlan",
    tableName: "client_diet_plans",
    underscored: true,
<<<<<<< HEAD
    timestamps: true,
=======
    timestamps: false,
>>>>>>> restaurent_backend
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ClientDietPlan.belongsTo(User, {
  foreignKey: "user_id",
  as: "client",
});
ClientDietPlan.belongsTo(User, {
  foreignKey: "trainer_id",
  as: "trainer",
});

module.exports = ClientDietPlan;
