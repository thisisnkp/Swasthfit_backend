// config/database.js
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER || 'root',
    password: process.env.DEV_DB_PASSWORD || null,
    database: process.env.DEV_DB_NAME || 'swasth',
    host: process.env.DEV_DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  // Define other environments (test, production) here
};
