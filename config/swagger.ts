// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SUBSUM API",
      version: "1.0.0",
      description: "API documentation for SUBSUM Application",
    },
    servers: [
      {
        url: "http://localhost:1212",
        description: "Local server",
      },
    ],
  },
  apis: [`${path.join("router", "router.ts")}`], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
