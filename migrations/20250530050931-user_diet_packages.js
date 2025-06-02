'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_diet_packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'foodrestaurants', // Make sure this matches your actual restaurants table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      diet_package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'diet_packages', // Make sure this matches your actual diet packages table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
        allowNull: false,
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
  }
};
