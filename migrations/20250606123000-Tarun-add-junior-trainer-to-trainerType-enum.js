'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change ENUM to include 'junior trainer' along with existing values
    await queryInterface.sequelize.query(
      "ALTER TABLE trainers MODIFY COLUMN trainerType ENUM('trainer', 'dietitian', 'swasthfit staff', 'junior trainer') NOT NULL DEFAULT 'trainer';"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert ENUM to previous values without 'junior trainer'
    await queryInterface.sequelize.query(
      "ALTER TABLE trainers MODIFY COLUMN trainerType ENUM('trainer', 'dietitian', 'swasthfit staff') NOT NULL DEFAULT 'trainer';"
    );
  },
};
