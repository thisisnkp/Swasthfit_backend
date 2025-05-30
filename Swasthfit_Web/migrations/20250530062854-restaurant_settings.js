'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('restaurant_settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // one-to-one relation
        references: {
          model: 'foodrestaurants', // Make sure this matches your FoodRestaurant table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      restaurant_logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      restaurant_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner_full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner_phone_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      alternate_phone_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      owner_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      full_address: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      zip_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      opening_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      close_time: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      meta_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      meta_tag_keyword: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      facebook_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      instagram_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      twitter_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      createdAt: {  // timestamps
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('restaurant_settings');
  },
};
