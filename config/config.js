require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USER || 'root',
    password: process.env.DEV_DB_PASSWORD || null,
    database: process.env.DEV_DB_NAME || 'swasth',
    host: process.env.DEV_DB_HOST || '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
