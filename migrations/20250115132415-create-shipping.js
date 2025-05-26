'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        references: { model: 'Products', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      weight: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      lenght: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      width: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      height: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      ship_class: { type: Sequelize.TEXT, allowNull: true },
      ship_company: {type: Sequelize.TEXT, allowNull: true},
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Products');
  },
};
