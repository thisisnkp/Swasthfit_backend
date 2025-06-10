'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'foodorders' table.
     * It includes fields such as 'id', 'order_id', 'restaurant_id', 'user_id',
     * 'rider_id', 'address_details' (JSON), 'item_details' (JSON),
     * 'Payment_via', 'total_amount', 'status', and timestamps.
     * Foreign key constraints are added for 'restaurant_id' referencing 'foodrestaurants'
     * and 'rider_id' referencing 'riders'. A foreign key is also added for 'user_id'
     * referencing the 'users' table, assuming its existence.
     */
    await queryInterface.createTable('foodorders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.STRING(8),
        unique: true,
        allowNull: false, // Assuming order_id should always be present
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodrestaurants', // Ensure this matches your actual FoodRestaurant table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      rider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'riders', // Assumes your rider table is named 'riders'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // Or 'CASCADE' depending on desired behavior
      },
      address_details: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      item_details: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      Payment_via: {
        type: Sequelize.STRING,
        allowNull: true, // Assuming this can be null if payment is not yet made or not applicable
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "Pending",
      },
      createdAt: { // Renamed from created_at to match model's underscored:false and createdAt alias
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: { // Renamed from updated_at to match model's underscored:false and updatedAt alias
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'foodorders' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('foodorders');
  }
};
