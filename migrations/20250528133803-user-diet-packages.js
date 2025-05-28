'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_diet_packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'food_restaurants', // Make sure this matches the actual table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      diet_package_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'diet_packages', // Make sure this matches the actual table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      breakfast_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      lunch_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      dinner_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      combo_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_diet_packages');
  },
};
