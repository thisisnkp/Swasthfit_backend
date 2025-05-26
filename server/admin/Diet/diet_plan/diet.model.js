const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../../../sequelize"); // Import Sequelize instance

const Diet = sequelize.define(
  "Diet",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    trainer_id: {
      type: DataTypes.STRING,
      allowNull: false, // Trainer who suggests the diet
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false, // Client receiving the diet suggestion
    },
    meal_type: {
      type: DataTypes.STRING,
      allowNull: false, // Breakfast, Lunch, Snacks, Dinner
    },
    food_item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fats: DataTypes.FLOAT,
    protein: DataTypes.FLOAT,
    carbs: DataTypes.FLOAT,
    intake_type: {
      type: DataTypes.STRING,
      defaultValue: "Compulsory",
    },
    remark: DataTypes.STRING,
    water_intake: {
      type: DataTypes.FLOAT,
      defaultValue: 0, // ML
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
  },
  {
    modelName: "Diet",
    tableName: "diets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Diet;
