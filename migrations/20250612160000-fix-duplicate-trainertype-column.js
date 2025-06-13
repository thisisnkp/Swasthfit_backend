"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("trainers");
    if (!tableDescription.trainerType) {
      await queryInterface.addColumn("trainers", "trainerType", {
        type: Sequelize.ENUM("trainer", "dietitian"),
        allowNull: true,
        comment: "Type of trainer: e.g., dietitian, trainer",
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable("trainers");
    if (tableDescription.trainerType) {
      await queryInterface.removeColumn("trainers", "trainerType");
    }
  },
};
