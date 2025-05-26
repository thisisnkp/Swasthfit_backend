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
      sku: { type: Sequelize.STRING, allowNull: true },
      product_code: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER, allowNull: true },
      backDoors: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      lowThreshold: {type: Sequelize.INTEGER, allowNull: true, defaultValue: 5},
      soldOne: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      stock: { type: Sequelize.INTEGER, allowNull: false },
      productImage: { type: Sequelize.TEXT, allowNull: true },
      shortDesc: {type: Sequelize.TEXT, allowNull: true},
      tags: {type: Sequelize.TEXT, allowNull: true},
      featuredImg: {type: Sequelize.TEXT, allowNull: true},
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Products');
  },
};
