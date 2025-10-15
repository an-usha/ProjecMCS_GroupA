const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info:{
        title: 'Call Center API Documentation',
        version: '1.0.0',
        description: 'API documentation for Call Center application',
    },
};

const options = {
    swaggerDefinition,
    apis:['../routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;