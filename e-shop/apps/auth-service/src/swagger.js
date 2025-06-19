import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Auth Service API",
    description: "Auto-generate API documentation using Swagger",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schemes: ["http"],
  swagger: "2.0", // ✅ valid version
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/user.routes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log("✅ Swagger documentation generated successfully");
  })
  .catch((error) => {
    console.error("❌ Error generating swagger documentation:", error);
  });
