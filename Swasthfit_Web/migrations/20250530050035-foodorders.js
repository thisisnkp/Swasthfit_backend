'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'restaurants', // Make sure this matches your actual restaurant table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: { model: 'users', key: 'id' }, // Optional: Uncomment if users table exists
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
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
        allowNull: true,
      },
      total_amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'Pending',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('foodorders');
  }
};
