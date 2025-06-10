'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'foodcarts' table.
     * It includes fields for 'id', 'user_id', 'fooditem_id', 'quantity',
     * and Sequelize's default 'created_at' and 'updated_at' timestamps.
     * A foreign key constraint is added for 'fooditem_id' referencing the 'fooditems' table.
     */
    await queryInterface.createTable('foodcarts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // If you have a 'users' table, you might want to add a foreign key here:
        // references: {
        //   model: 'users', // Replace 'users' with your actual users table name
        //   key: 'id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      fooditem_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fooditems', // Ensure this matches your actual FoodItem table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Deletes cart item if the associated food item is deleted
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'foodcarts' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('foodcarts');
  }
};
