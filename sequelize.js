const { Sequelize } = require('sequelize');
const dbConfig = require('./config/database');  // Import database config
const process = require('process');

// Get the current environment
const env = process.env.NODE_ENV || 'development';

// Get the configuration for the current environment
const currentConfig = dbConfig[env];

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


// const User = require("./models/user.model");
// const EasebuzzTransaction = require("./models/easebuzz.model");
// const EasebuzzRefund = require("./models/easebuzz_refund.model");
// const EasebuzzWebhook = require("./models/easebuzz_webhook.model");

// sequelize
//   .sync({ alter: true })
//   .then(() => console.log("Database & tables created!"))
//   .catch((error) => console.error("Error syncing database:", error));

// module.exports = sequelize;
// const sequelize = new Sequelize('swasth', 'root', '', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

module.exports = sequelize;


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
