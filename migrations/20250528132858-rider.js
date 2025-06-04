'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('riders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      home_location_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      home_latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      home_longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      aadhar_number: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      type_of_rider: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rider_tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      on_task: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      current_latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
      current_longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('riders');
  },
};
