<<<<<<< HEAD
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("foodcategories", {
=======
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('FoodCategories', {
>>>>>>> restaurent_backend
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      img: {
        type: Sequelize.STRING,
<<<<<<< HEAD
        allowNull: true,
=======
        allowNull: true
>>>>>>> restaurent_backend
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
<<<<<<< HEAD
=======
        references: {
          model: 'FoodRestaurants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
>>>>>>> restaurent_backend
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
<<<<<<< HEAD
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
=======
        references: {
          model: 'FoodCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
<<<<<<< HEAD
    await queryInterface.dropTable("foodcategories");
  },
=======
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('FoodCategories');
  }
>>>>>>> restaurent_backend
};
