import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "CIGAS API",
        description: "CIGAS API Documentation"
    },
    host: "localhost:3000",
    tags: [{
        name: "Authorization",
    },
    {
        name: "Users",
    }]
};

const outputFile = "../swagger.json";
const routes = ["./index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);