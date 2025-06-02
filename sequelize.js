const { Sequelize } = require('sequelize');
const dbConfig = require('./config/database');  // Import database config
const process = require('process');

// Get the current environment
const env = process.env.NODE_ENV || 'development';

// Get the configuration for the current environment
const currentConfig = dbConfig[env];

// Initialize Sequelize with the current configuration
const sequelize = new Sequelize(
  currentConfig.database,
  currentConfig.username,
  currentConfig.password,
  {
    host: currentConfig.host,
    dialect: currentConfig.dialect,
    logging: false, // Disable logging; set to true for debugging
  }
);

// Test the database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
