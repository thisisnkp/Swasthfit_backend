<<<<<<< HEAD
"use strict";
=======
'use strict';
>>>>>>> restaurent_backend

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
<<<<<<< HEAD
    await queryInterface.createTable("FoodItemOffers", {
=======
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('FoodItemOffers', {
>>>>>>> restaurent_backend
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
<<<<<<< HEAD
=======
        references: {
          model: 'FoodItems',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
>>>>>>> restaurent_backend
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
<<<<<<< HEAD
        comment: "Minimum quantity required for the offer",
=======
        comment: 'Minimum quantity required for the offer',
>>>>>>> restaurent_backend
      },
      offer_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
<<<<<<< HEAD
        comment: "Price for the specified quantity",
=======
        comment: 'Price for the specified quantity',
>>>>>>> restaurent_backend
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
<<<<<<< HEAD
        comment: "Offer start date",
=======
        comment: 'Offer start date',
>>>>>>> restaurent_backend
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
<<<<<<< HEAD
        comment: "Offer end date",
=======
        comment: 'Offer end date',
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
      },
    });

    // Add foreign key for item_id → FoodItems.id
    await queryInterface.addConstraint("FoodItemOffers", {
      fields: ["item_id"],
      type: "foreign key",
      name: "fk_fooditemoffers_itemid", // unique constraint name
      references: {
        table: "FoodItems",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    // Add foreign key for created_by → FoodRestaurants.id
    await queryInterface.addConstraint("FoodItemOffers", {
      fields: ["created_by"],
      type: "foreign key",
      name: "fk_fooditemoffers_createdby", // unique constraint name
      references: {
        table: "FoodRestaurants",
        field: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("FoodItemOffers");
  },
=======
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('FoodItemOffers');
  }
>>>>>>> restaurent_backend
};
