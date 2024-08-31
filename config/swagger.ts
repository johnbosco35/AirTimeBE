// swagger.ts
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0", // Specify OpenAPI version
    info: {
      title: "My API",
      version: "1.0.0",
      description: "A simple API documentation",
    },
    servers: [
      {
        url: "http://localhost:3000", // Your API server URL
      },
    ],
  },
  apis: ["./src/routes/**/*.ts"], // Path to your API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const swaggerSetup = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerDocs);
