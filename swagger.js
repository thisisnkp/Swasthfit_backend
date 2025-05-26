const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'This is the API documentation for our project',
  },
  servers: [
    {
      url: 'http://localhost:4001', // Replace with your server's URL
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/**/*.js'],
};

const swaggerSpec = require('swagger-jsdoc')(options);
module.exports = swaggerSpec;