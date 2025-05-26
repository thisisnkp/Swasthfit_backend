'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('diets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      trainer_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      meal_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      food_item: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fats: {
        type: Sequelize.FLOAT,
      },
      protein: {
        type: Sequelize.FLOAT,
      },
      carbs: {
        type: Sequelize.FLOAT,
      },
      intake_type: {
        type: Sequelize.STRING,
        defaultValue: 'Compulsory',
      },
      remark: {
        type: Sequelize.STRING,
      },
      water_intake: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('diets');
  },
};
