'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change ENUM to include 'swasthfit staff'
    await queryInterface.sequelize.query(
      "ALTER TABLE trainers MODIFY COLUMN trainerType ENUM('trainer', 'dietitian', 'swasthfit staff') NOT NULL DEFAULT 'trainer';"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert ENUM to original values
    await queryInterface.sequelize.query(
      "ALTER TABLE trainers MODIFY COLUMN trainerType ENUM('trainer', 'dietitian') NOT NULL DEFAULT 'trainer';"
    );
  },
};
