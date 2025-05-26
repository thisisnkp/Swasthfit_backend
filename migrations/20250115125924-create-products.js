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
      vendorId: {
        type: Sequelize.INTEGER,
        references: { model: 'Vendors', key: 'id' },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: { model: 'Categories', key: 'id' },
        allowNull: false,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      rPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      sPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      stock: { type: Sequelize.INTEGER, allowNull: false },
      productImage: { type: Sequelize.TEXT, allowNull: true },
      shortDesc: {type: Sequelize.TEXT, allowNull: true},
      tags: {type: Sequelize.TEXT, allowNull: true},
      featuredImg: {type: Sequelize.TEXT, allowNull: true},
      attributes: { type: Sequelize.TEXT, allowNull: true },
      purchaseNote: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Products');
  },
};
