'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change trainer_id column to JSON type to store array of junior trainer IDs
    await queryInterface.changeColumn('senior_trainers', 'trainer_id', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert trainer_id column back to INTEGER type
    await queryInterface.changeColumn('senior_trainers', 'trainer_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
