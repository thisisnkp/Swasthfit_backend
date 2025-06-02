'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('diet_packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'food_restaurants', // Must match the actual table name, not model name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      breakfast: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lunch: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dinner: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      combo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('diet_packages');
  }
};
