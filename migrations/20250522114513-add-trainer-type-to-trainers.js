"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("trainers", "trainerType", {
      type: Sequelize.ENUM("trainer", "dietitian"),
      allowNull: true,
      comment: "Type of trainer: e.g., dietitian, trainer",
    });

    await queryInterface.addColumn("trainers", "availableDays", {
      type: Sequelize.JSON,
      allowNull: true,
      comment:
        'Days trainer is available: e.g., ["monday", "wednesday", "friday"]',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("trainers", "trainerType");
    await queryInterface.removeColumn("trainers", "availableDays");
  },
};
