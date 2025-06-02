<<<<<<< HEAD
"use strict";
=======
'use strict';
>>>>>>> restaurent_backend

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
    await queryInterface.createTable("FoodOrderPrices", {
=======
    await queryInterface.createTable('FoodOrderPrices', {
>>>>>>> restaurent_backend
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
<<<<<<< HEAD
        allowNull: false,
      },
      item_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.0,
      },
      delivery_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.0,
      },
      discount_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.0,
      },
      tax: {
        type: Sequelize.DOUBLE,
        allowNull: 0.0,
      },
      total_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.0,
=======
        allowNull: false
      },
      item_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.00
      },
      delivery_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.00
      },
      discount_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.00
      },
      tax: {
        type: Sequelize.DOUBLE,
        allowNull: 0.00
      },
      total_price: {
        type: Sequelize.DOUBLE,
        allowNull: 0.00
>>>>>>> restaurent_backend
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
<<<<<<< HEAD
  },
=======
  }
>>>>>>> restaurent_backend
};
