const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CIGAS API",
    version: "1.0.0"
  },

  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "cookie"
      }
    },
    schemas: {
      user: {
        title: "User",
        type: "object",
        properties: {
          id: {
            type: "number",
            example: 2
          },
          FirstName: {
            type: "string",
            example: "John"
          },
          LastName: {
            type: "string",
            example: "Doe"
          },
          email: {
            type: "string",
            example: "john@example.org"
          },
          phone: {
            type: "string",
            example: "(87) 98812-3456"
          },
          role: {
            type: "string",
            example: "Hardcoded"
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./**/*.ts"]
};

export default options;
