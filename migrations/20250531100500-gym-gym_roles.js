"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add 'staff_id' column
    await queryInterface.addColumn("gym_roles", "staff_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // (Optional) Ensure 'gym_id' exists (skip this if it already does)
    await queryInterface.addColumn("gym_roles", "gym_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove 'staff_id' column
    await queryInterface.removeColumn("gym_roles", "staff_id");

    // (Optional) Remove 'gym_id' column if needed
    await queryInterface.removeColumn("gym_roles", "gym_id");
  },
};
