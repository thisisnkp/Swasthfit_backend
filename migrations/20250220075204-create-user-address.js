<<<<<<< HEAD
"use strict";
=======
'use strict';
>>>>>>> restaurent_backend

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
<<<<<<< HEAD
    await queryInterface.createTable("UserAddress", {
=======
    await queryInterface.createTable('UserAddress', {
>>>>>>> restaurent_backend
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
<<<<<<< HEAD
        allowNull: false,
=======
        allowNull: false
>>>>>>> restaurent_backend
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      house_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      longitude: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
<<<<<<< HEAD
        defaultValue: 1,
=======
        defaultValue: 1
>>>>>>> restaurent_backend
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
<<<<<<< HEAD
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
=======
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
>>>>>>> restaurent_backend
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
<<<<<<< HEAD
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
        ),
=======
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
>>>>>>> restaurent_backend
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
<<<<<<< HEAD
    await queryInterface.dropTable("UserAddress");
  },
=======
    await queryInterface.dropTable('UserAddress');
  }
>>>>>>> restaurent_backend
};
