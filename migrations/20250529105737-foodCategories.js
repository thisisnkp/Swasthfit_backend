'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foodcategories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('foodcategories');
  }
};
