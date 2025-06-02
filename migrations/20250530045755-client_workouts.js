'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_workouts', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        // references: { model: 'users', key: 'id' }, // Optional FK
        // onDelete: 'CASCADE',
      },
      trainer_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        // references: { model: 'users', key: 'id' }, // Optional FK
        // onDelete: 'CASCADE',
      },
      day: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false,
      },
      body_part: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      exercise_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sets: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      reps: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      duration_min: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      remark: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      media_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      media_type: {
        type: Sequelize.ENUM('mp4', 'gif', 'mp3', 'jpg', 'jpeg', 'png'),
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client_workouts');
  }
};
