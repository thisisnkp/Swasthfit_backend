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
    await queryInterface.createTable("FoodFavoriteResturants", {
=======
    await queryInterface.createTable('FoodFavoriteResturants', {
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
      },
      rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
=======
        allowNull: false
      },
      rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
>>>>>>> restaurent_backend
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
  },
=======
  }
>>>>>>> restaurent_backend
};
