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
    await queryInterface.createTable("FoodFavoriteItems", {
=======
    await queryInterface.createTable('FoodFavoriteItems', {
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
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
=======
        allowNull: false
      },
      item_id: {
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
