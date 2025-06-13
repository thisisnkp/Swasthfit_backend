"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("easebuzz_payment", {
      fields: ["txnid"],
      type: "unique",
      name: "unique_txnid_constraint",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "easebuzz_payment",
      "unique_txnid_constraint"
    );
  },
};
