'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'foodfavoriteresturants' table.
     * It includes 'user_id' and 'rest_id' columns.
     * Foreign key constraints are added for 'user_id' referencing the 'users' table
     * and 'rest_id' referencing the 'foodrestaurants' table.
     */
    await queryInterface.createTable('foodfavoriteresturants', {
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
      rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodrestaurants', // Assumes your food restaurants table is named 'foodrestaurants'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Note: The FavoriteRestaurants model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here
      // to match the model's configuration.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'foodfavoriteresturants' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('foodfavoriteresturants');
  }
};
