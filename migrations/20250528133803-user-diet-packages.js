'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_diet_packages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      diet_package_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      breakfast_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      lunch_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      dinner_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      combo_price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    });

    // Add foreign key for restaurant_id
    await queryInterface.addConstraint('user_diet_packages', {
      fields: ['restaurant_id'],
      type: 'foreign key',
      name: 'fk_userdiet_restaurant_id',
      references: {
        table: 'FoodRestaurants',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Add foreign key for diet_package_id
    await queryInterface.addConstraint('user_diet_packages', {
      fields: ['diet_package_id'],
      type: 'foreign key',
      name: 'fk_userdiet_package_id',
      references: {
        table: 'diet_packages',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_diet_packages');
  },
};
