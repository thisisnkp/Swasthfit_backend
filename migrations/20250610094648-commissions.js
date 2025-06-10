'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'commissions' table.
     * It includes fields such as 'fixed', 'amount', 'type', 'applies_to',
     * 'applied_id', 'status', 'created_by', 'updated_by', and timestamps.
     * A foreign key constraint is added for 'applied_id' referencing the
     * 'foodsubcategories' table, with ON DELETE CASCADE.
     */
    await queryInterface.createTable('commissions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      fixed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('percentage', 'flat'),
        allowNull: false,
        defaultValue: 'percentage',
      },
      applies_to: {
        type: Sequelize.ENUM('subcategory', 'category', 'restaurant'),
        allowNull: false,
      },
      applied_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Foreign key to FoodSubCategory, assuming the table name is 'foodsubcategories'
        references: {
          model: 'foodsubcategories', // Ensure this matches your actual FoodSubCategory table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'commissions' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('commissions');
  }
};
