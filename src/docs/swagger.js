const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Node CRUD',
    description: 'Node Generic CRUD',
  },
  servers: [
    {
      url: 'http://localhost:8000',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Endpoints related to user authentication',
    },
    {
      name: 'Project Management',
      description: 'Endpoints for managing users',
    },
    {
      name: 'Products',
      description: 'Endpoints related to user authentication',
    },
    {
      name: 'User Management',
      description: 'Endpoints for managing users',
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Bearer Token authentication',
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = '../docs/swagger.json'; // Path to the generated swagger JSON file
const endpointsFiles = ['../index.js']; // Paths to your route files

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('../index.js'); // Your main app file
});
