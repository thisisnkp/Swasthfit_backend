'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'client_workouts' table.
     * It includes fields such as user_id, trainer_id, day, body_part,
     * exercise_name, sets, reps, duration_min, remark, media_url, and media_type.
     * Foreign key constraints are added for 'user_id' and 'trainer_id'
     * referencing the 'users' table.
     */
    await queryInterface.createTable('client_workouts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Assumes your users table is named 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'client_workouts' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('client_workouts');
  }
};
