'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'restvendors' table.
     * It includes fields for user association, vendor identity, business details,
     * contact information, authentication, and vendor type.
     * A foreign key constraint is added for 'user_id' referencing the 'users' table.
     */
    await queryInterface.createTable('restvendors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // The actual table name of your User model
          key: 'id',      // The primary key of the users table
        },
        onDelete: 'CASCADE', // If a user is deleted, associated vendors are also deleted
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true, // Assuming default allowNull is true if not specified
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      business_name: { // Using snake_case for consistency due to `timestamps: true` often implying `underscored: true`
        type: Sequelize.STRING,
        allowNull: true,
      },
      business_email: { // Using snake_case
        type: Sequelize.STRING,
        allowNull: true,
      },
      pan: { // Using snake_case
        type: Sequelize.STRING,
        allowNull: true,
      },
      gst: { // Using snake_case
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      vendor_type: { // Using snake_case
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
     * This 'down' migration will drop the 'restvendors' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('restvendors');
  }
};
