'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'foodfavoriteitems' table.
     * It includes 'user_id' and 'item_id' columns.
     * Foreign key constraints are added for 'user_id' referencing the 'users' table
     * and 'item_id' referencing the 'fooditems' table.
     */
    await queryInterface.createTable('foodfavoriteitems', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assumes your users table is named 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fooditems', // Assumes your food items table is named 'fooditems'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Note: The FavoriteItems model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here
      // to match the model's configuration.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'foodfavoriteitems' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('foodfavoriteitems');
  }
};
