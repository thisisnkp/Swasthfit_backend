"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("client_diet_plans", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      trainer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      meal_type: {
        type: Sequelize.ENUM("Breakfast", "Lunch", "Snacks", "Dinner", "Water"),
        allowNull: false,
      },
      food_item_name: Sequelize.STRING,
      quantity: Sequelize.FLOAT,
      quantity_unit: Sequelize.STRING,
      fats: Sequelize.FLOAT,
      protein: Sequelize.FLOAT,
      carbs: Sequelize.FLOAT,
      food_type: {
        type: Sequelize.ENUM("Compulsory", "Optional"),
        defaultValue: "Compulsory",
      },
      remark: Sequelize.TEXT,
      water_intake: Sequelize.FLOAT,
      water_intake_unit: {
        type: Sequelize.STRING,
        defaultValue: "ML",
      },
      breakfast_price: Sequelize.FLOAT,
      lunch_price: Sequelize.FLOAT,
      dinner_price: Sequelize.FLOAT,
      snacks_price: Sequelize.FLOAT,
      combo_price: Sequelize.FLOAT,
      discount_type: Sequelize.ENUM("Fixed", "Percentage"),
      discount_value: Sequelize.FLOAT,
      plan_days: Sequelize.INTEGER,
      optional_item_name: Sequelize.STRING,
      optional_item_price: Sequelize.FLOAT,
      meal_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: "For ordering multiple items within the same meal type",
      },
      is_water_intake: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
        allowNull: false,
      },
    });

    // Add foreign key for user_id
    await queryInterface.addConstraint("client_diet_plans", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_clientdietplans_userid",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Add foreign key for trainer_id
    await queryInterface.addConstraint("client_diet_plans", {
      fields: ["trainer_id"],
      type: "foreign key",
      name: "fk_clientdietplans_trainerid",
      references: {
        table: "users",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("client_diet_plans");
  },
};
