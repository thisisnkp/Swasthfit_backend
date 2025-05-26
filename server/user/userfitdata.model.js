const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const User = require('./user.model');

// Define the UserFitData model
const UserFitData = sequelize.define(
  'user_fit_data',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Ensure this matches the table name in the database
        key: 'id',
      },
      onDelete: 'CASCADE',  // Ensure referential integrity
      onUpdate: 'CASCADE',  // Ensure referential integrity
    },
    target_weight: { 
      type: DataTypes.FLOAT,   // in MKS
      allowNull: false,
    },
    per_exp: {
      type: DataTypes.TEXT, // Replaced JSONB with TEXT for MariaDB
      allowNull: true,      // Can store JSON-like data as strings or serialized JSON
    },
    sickness: {
      type: DataTypes.TEXT, // Replaced JSONB with TEXT for MariaDB
      allowNull: true,      // Can store JSON-like data as strings or serialized JSON
    },
    physical_activity: {
      type: DataTypes.TEXT, // Replaced JSONB with TEXT for MariaDB
      allowNull: true,      // Can store JSON-like data as strings or serialized JSON
    },
    fit_goal: {    //MKS
      type: DataTypes.TEXT, // Replaced JSONB with TEXT for MariaDB
      allowNull: true,      // Can store JSON-like data as strings or serialized JSON
    },
    gender: {
      type: DataTypes.STRING(10), // Example: 'Male', 'Female', 'Other'
      allowNull: false,
    },
    // units: {
    //   type: DataTypes.TEXT, // For send unites data first 'Height','Weight', 'Target Weight'
    //   allowNull: false,
    // },
  },
  {
    sequelize,
    modelName: 'UserFitData',
    tableName: 'user_fit_data',
    timestamps: true, // Enables createdAt and updatedAt fields
    createdAt: 'created_at', // Custom column name for createdAt
    updatedAt: 'updated_at', // Custom column name for updatedAt
  }
);

// Validate hook to ensure arrays are serialized before validation
UserFitData.addHook('beforeValidate', (userFitData, options) => {
  const fieldsToSerialize = ['per_exp', 'sickness', 'physical_activity', 'fit_goal'];
  
  fieldsToSerialize.forEach(field => {
    if (Array.isArray(userFitData[field])) {
      userFitData[field] = JSON.stringify(userFitData[field]);
    }
  });
});

// Deserialize JSON strings into arrays after fetching
UserFitData.afterFind((userFitData, options) => {
  if (userFitData) {
    const fieldsToDeserialize = ['per_exp', 'sickness', 'physical_activity', 'fit_goal'];
    
    fieldsToDeserialize.forEach(field => {
      if (typeof userFitData[field] === 'string') {
        userFitData[field] = JSON.parse(userFitData[field]);
      }
    });
  }
});

User.associate({ UserFitData });
module.exports = UserFitData;
