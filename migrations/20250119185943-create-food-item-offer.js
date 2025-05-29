"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FoodItemOffers", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Minimum quantity required for the offer",
      },
      offer_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: "Price for the specified quantity",
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Offer start date",
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Offer end date",
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
      },
    });

    // Add foreign key for item_id → FoodItems.id
    await queryInterface.addConstraint("FoodItemOffers", {
      fields: ["item_id"],
      type: "foreign key",
      name: "fk_fooditemoffers_itemid", // unique constraint name
      references: {
        table: "FoodItems",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Add foreign key for created_by → FoodRestaurants.id
    await queryInterface.addConstraint("FoodItemOffers", {
      fields: ["created_by"],
      type: "foreign key",
      name: "fk_fooditemoffers_createdby", // unique constraint name
      references: {
        table: "FoodRestaurants",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FoodItemOffers");
  },
};
