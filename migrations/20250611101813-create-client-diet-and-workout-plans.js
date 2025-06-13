'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create client_diet_plans table
    await queryInterface.createTable('client_diet_plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      meal_type: {
        type: Sequelize.ENUM("Breakfast", "Lunch", "Snacks", "Dinner", "Water"),
        allowNull: false,
      },
      food_item_name: Sequelize.STRING,
      quantity: Sequelize.FLOAT,
      quantity_unit: Sequelize.STRING,
      fats: Sequelize.FLOAT,
      protein: Sequelize.FLOAT,
      carbs: Sequelize.FLOAT,
      food_type: {
        type: Sequelize.ENUM("Compulsory", "Optional"),
        defaultValue: "Compulsory",
      },
      remark: Sequelize.TEXT,
      water_intake: Sequelize.FLOAT,
      water_intake_unit: {
        type: Sequelize.STRING,
        defaultValue: "ML",
      },
      breakfast_price: Sequelize.FLOAT,
      lunch_price: Sequelize.FLOAT,
      dinner_price: Sequelize.FLOAT,
      snacks_price: Sequelize.FLOAT,
      combo_price: Sequelize.FLOAT,
      discount_type: Sequelize.ENUM("Fixed", "Percentage"),
      discount_value: Sequelize.FLOAT,
      plan_days: Sequelize.INTEGER,
      optional_item_name: Sequelize.STRING,
      optional_item_price: Sequelize.FLOAT,
      meal_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_water_intake: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // 2. Create client_workouts table
    await queryInterface.createTable('client_workouts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      trainer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      day: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false,
      },
      body_part: Sequelize.STRING,
      exercise_name: Sequelize.STRING,
      sets: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      reps: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      duration_min: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      remark: Sequelize.TEXT,
      media_url: Sequelize.STRING,
      media_type: Sequelize.ENUM('mp4', 'gif', 'mp3', 'jpg', 'jpeg', 'png'),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

    // 3. Create restaurant_diet_plans table
    await queryInterface.createTable('restaurant_diet_plans', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      client_diet_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'client_diet_plans', key: 'id' },
        onDelete: 'CASCADE',
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'foodrestaurants', key: 'id' },
        onDelete: 'CASCADE',
      },
      breakfast_price: Sequelize.FLOAT,
      lunch_price: Sequelize.FLOAT,
      dinner_price: Sequelize.FLOAT,
      snacks_price: Sequelize.FLOAT,
      combo_price: Sequelize.FLOAT,
      optional_item_price: Sequelize.FLOAT,
      status: {
        type: Sequelize.ENUM("Pending", "Approved", "Rejected"),
        defaultValue: "Pending",
      },
      remark: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });

// 4. Create diet_packages table
await queryInterface.createTable('diet_packages', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  restaurant_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: { model: 'foodrestaurants', key: 'id' },
    onDelete: 'SET NULL', // or CASCADE if needed
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  img: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  breakfast: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  lunch: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  dinner: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  combo: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  breakfast_price: Sequelize.FLOAT,
  lunch_price: Sequelize.FLOAT,
  dinner_price: Sequelize.FLOAT,
  combo_price: Sequelize.FLOAT,
  latitude: Sequelize.FLOAT,
  longitude: Sequelize.FLOAT,
});
// 5. Create user_diet_packages table
await queryInterface.createTable('user_diet_packages', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  restaurant_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'foodrestaurants',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  diet_package_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'diet_packages',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: Sequelize.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
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

  },

   async down(queryInterface, Sequelize) {
  await queryInterface.dropTable('diet_packages');
  await queryInterface.dropTable('restaurant_diet_plans');
  await queryInterface.dropTable('client_workouts');
  await queryInterface.dropTable('client_diet_plans');
await queryInterface.dropTable('user_diet_packages');


  }
};
