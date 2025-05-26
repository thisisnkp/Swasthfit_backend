'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('workouts', {
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
      day: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        defaultValue: 'WORKOUT',
      },
      exercise_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sub_exercise_name: {
        type: Sequelize.STRING,
      },
      sets: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      reps: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      duration: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      remark: {
        type: Sequelize.TEXT,
      },
      media_url: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('workouts');
  },
};
