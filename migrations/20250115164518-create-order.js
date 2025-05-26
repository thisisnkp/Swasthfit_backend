'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      status: { type: Sequelize.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'), allowNull: false },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      paymentStatus: { type: Sequelize.ENUM('paid', 'unpaid'), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Orders');
  },
};