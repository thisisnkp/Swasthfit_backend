require('dotenv').config();
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET, // Secret from .env file
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION, // Expiration from .env file
};
