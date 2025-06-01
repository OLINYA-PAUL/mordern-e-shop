import swaggerAutgen from "swagger-autogen";

const doc = {
  info: {
    title: "Auto",
    description: "Auto generate api documentaion",
    version: "1.0.0",
  },
  host: "localhost:6001",
  schemes: ["http"],
};

const outPutFile = "./swagger-output.json";
const endPointFiles = ["./routes/user.routes.ts"];

swaggerAutgen()(outPutFile, endPointFiles, doc);
