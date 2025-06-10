'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'fooditemoffers' table.
     * It includes fields such as 'id', 'item_id', 'min_quantity', 'offer_price',
     * 'start_date', 'end_date', 'image', and timestamps (createdAt, updatedAt).
     * A foreign key constraint is added for 'item_id' referencing the 'fooditems' table.
     */
    await queryInterface.createTable('fooditemoffers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fooditems', // Ensure this matches your actual FoodItem table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      offer_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'fooditemoffers' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('fooditemoffers');
  }
};
