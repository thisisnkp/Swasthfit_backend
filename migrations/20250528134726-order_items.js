"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "foodorders", // Table containing order records
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "FoodItems", // ✅ Should match actual food item table
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
    });

    // Optional: Add composite primary key if needed
    // await queryInterface.addConstraint("order_items", {
    //   fields: ["order_id", "item_id"],
    //   type: "primary key",
    //   name: "pk_order_items"
    // });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("order_items");
  },
};
