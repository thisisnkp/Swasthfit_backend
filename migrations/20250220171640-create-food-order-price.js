'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FoodOrderPrices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
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
  }
};
