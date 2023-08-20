import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "CIGAS API",
    description: "CIGAS API Documentation"
  },
  host: "localhost:3000",
  tags: [{
    name: "Authorization"
  },
  {
    name: "Users"
  }],

  definitions: {
    User: {
      id: 2,
      FirstName: "John",
      LastName: "Doe",
      email: "john@examplee.org",
      phone: null,
      role: "Hardcoded"
    }
  }
};

const outputFile = "swagger.json";
const routes = ["./index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
// eslint-disable-next-line @typescript-eslint/no-floating-promises
swaggerAutogen()(outputFile, routes, doc);
