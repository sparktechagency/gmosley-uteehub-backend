import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import config from '../config';
import { swaggerDefinition, swaggerTags } from './swaggerDefinition';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: `${config.server_name} API`,
      version: '1.0.0',
      description: `API documentation for your ${config.server_name}`,
      contact: {
        name: 'Fahad Hossain',
        email: 'fahadhossain0503@gmail.com',
        url: 'https://www.linkedin.com/in/1fahadhossain/',
      },
      license: {
        name: 'Spark Tech',
        url: 'https://www.sparktech.agency/',
      },
    },
    servers: [
      {
        url: 'http://localhost:5050/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: swaggerDefinition
    },
    security: [{ bearerAuth: [] }],
    tags: swaggerTags
  },
  apis: [path.join(__dirname, '../app/modules/**/*.ts')],
};

export const swaggerSpec = swaggerJSDoc(options);
