"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transcriptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      meeting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      channel_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transcription_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      summary_text: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      video_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transcriptions");
  },
};
