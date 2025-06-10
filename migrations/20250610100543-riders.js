'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * This migration creates the 'riders' table.
     * It includes fields such as 'first_name', 'last_name', 'mobile',
     * 'is_active', 'date_of_birth', 'home_location_name', 'home_latitude',
     * 'home_longitude', 'aadhar_number', 'type_of_rider', 'owner_id',
     * 'rider_tags', 'on_task', 'current_latitude', and 'current_longitude'.
     * This model has 'timestamps: false', so created_at and updated_at columns
     * are not included in this migration.
     */
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
        allowNull: true, // Assuming it can be null if not provided
      },
      home_location_name: {
        type: Sequelize.STRING,
        allowNull: true, // Assuming it can be null if not provided
      },
      home_latitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true, // Assuming it can be null if not provided
      },
      home_longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true, // Assuming it can be null if not provided
      },
      aadhar_number: {
        type: Sequelize.STRING(12),
        allowNull: true, // Assuming it can be null if not provided
      },
      type_of_rider: {
        type: Sequelize.INTEGER,
        allowNull: true, // Assuming it can be null if not provided
      },
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // Assuming it can be null if not provided
        // If there's an 'owners' or 'users' table, you might add a foreign key here
        // references: {
        //   model: 'users', // or 'owners'
        //   key: 'id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'SET NULL',
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
        allowNull: true, // Assuming it can be null if not provided
      },
      current_longitude: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: true, // Assuming it can be null if not provided
      },
      // Note: The Rider model has `timestamps: false`,
      // so created_at and updated_at columns are intentionally omitted here.
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * This 'down' migration will drop the 'riders' table,
     * reverting the changes made by the 'up' migration.
     */
    await queryInterface.dropTable('riders');
  }
};
