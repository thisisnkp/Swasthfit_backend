'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Riders
    await queryInterface.createTable('riders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      mobile: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      date_of_birth: Sequelize.DATE,
      home_location_name: Sequelize.STRING,
      home_latitude: Sequelize.DECIMAL(10, 7),
      home_longitude: Sequelize.DECIMAL(10, 7),
      aadhar_number: Sequelize.STRING(12),
      type_of_rider: Sequelize.INTEGER,
      owner_id: Sequelize.INTEGER,
      rider_tags: Sequelize.JSON,
      on_task: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      current_latitude: Sequelize.DECIMAL(10, 7),
      current_longitude: Sequelize.DECIMAL(10, 7),
    });

    // FoodItems
    await queryInterface.createTable('fooditems', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'foodcategories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      menu_name: Sequelize.STRING,
      description: Sequelize.STRING,
      menu_img: Sequelize.STRING,
      price: Sequelize.FLOAT,
      discount: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      total_quantity: Sequelize.INTEGER,
      unit: Sequelize.STRING,
      cost_price: Sequelize.FLOAT,
      calories: Sequelize.FLOAT,
      diet_type: {
        type: Sequelize.ENUM('veg', 'non_veg', 'vegan', 'eggetarian'),
        defaultValue: 'veg',
      },
      variants: Sequelize.STRING,
      addons: Sequelize.STRING,
      spice_level: {
        type: Sequelize.ENUM('none', 'mild', 'medium', 'hot'),
        defaultValue: 'none',
      },
      tags: Sequelize.STRING,
      prep_time: Sequelize.INTEGER,
      available: { type: Sequelize.BOOLEAN, defaultValue: true },
      is_recommended: { type: Sequelize.BOOLEAN, defaultValue: false },
      rating: { type: Sequelize.FLOAT, defaultValue: 0.0 },
      distance: Sequelize.FLOAT,
      ingredients: Sequelize.STRING,
      cuisine_type: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // FoodOrders
    await queryInterface.createTable('foodorders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: Sequelize.STRING(8),
        unique: true,
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'restaurants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'riders', key: 'id' },
      },
      address_details: { type: Sequelize.JSON, allowNull: false },
      item_details: { type: Sequelize.JSON, allowNull: false },
      Payment_via: Sequelize.STRING,
      total_amount: { type: Sequelize.FLOAT, allowNull: false },
      status: { type: Sequelize.STRING, defaultValue: 'Pending' },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // FoodOrderPrices
    await queryInterface.createTable('foodorderprices', {
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    
      },
      item_price: { type: Sequelize.DOUBLE, defaultValue: 0.0 },
      delivery_price: { type: Sequelize.DOUBLE, defaultValue: 0.0 },
      discount_price: { type: Sequelize.DOUBLE, defaultValue: 0.0 },
      tax: { type: Sequelize.DOUBLE, defaultValue: 0.0 },
      total_price: { type: Sequelize.DOUBLE, defaultValue: 0.0 },
    });

    // Cart
    await queryInterface.createTable('foodcarts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      fooditem_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'fooditems', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    // Commission
    await queryInterface.createTable('commissions', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      fixed: { type: Sequelize.BOOLEAN, defaultValue: false },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      type: {
        type: Sequelize.ENUM('percentage', 'flat'),
        allowNull: false,
        defaultValue: 'percentage',
      },
      applies_to: {
        type: Sequelize.ENUM('subcategory', 'category', 'restaurant'),
        allowNull: false,
      },
      applied_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_by: Sequelize.INTEGER,
      updated_by: Sequelize.INTEGER,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

      // 1. Food Favorite Items
    await queryInterface.createTable('foodfavoriteitems', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

    // 2. Food Favorite Restaurants
    await queryInterface.createTable('foodfavoriteresturants', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rest_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });

    // 3. Food Categories
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
      slug: Sequelize.STRING,
      description: Sequelize.STRING,
      img: Sequelize.STRING,
      created_by: Sequelize.INTEGER,
      parent_id: Sequelize.INTEGER,
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

    // 4. Food Subcategories
    await queryInterface.createTable('foodsubcategories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: Sequelize.STRING,
      slug: Sequelize.STRING,
      img: Sequelize.STRING,
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodcategories',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      commission: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0
      },
      created_by: Sequelize.INTEGER,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 5. Food Item Offers
    await queryInterface.createTable('fooditemoffers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fooditems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      offer_price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      image: Sequelize.STRING,
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 6. Order Items
    await queryInterface.createTable('order_items', {
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'foodorders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fooditems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('commissions');
    await queryInterface.dropTable('foodcarts');
    await queryInterface.dropTable('foodorderprices');
    await queryInterface.dropTable('foodorders');
    await queryInterface.dropTable('fooditems');
    await queryInterface.dropTable('riders');
     await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('fooditemoffers');
    await queryInterface.dropTable('foodsubcategories');
    await queryInterface.dropTable('foodcategories');
    await queryInterface.dropTable('foodfavoriteresturants');
    await queryInterface.dropTable('foodfavoriteitems');
  },
};
