import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Auth Service API",
    description: "Auto-generate API documentation using Swagger",
    version: "1.0.0",
  },
  host: "localhost:6001", // Change if your port is different
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/user.routes.ts"]; // Adjust if routes are in a different path

swaggerAutogen()(outputFile, endpointsFiles, doc);
