import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { validationError } from "../../../packages/error-handler/errorMiddleware";
import authrouter from "./routes/user.routes";
import swaggerUi from "swagger-ui-express";
const swaggerDocument = require("./swagger-output.json");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});

app.use("/swagger-api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/doc-swagger", (req: Request, res: Response) => {
  res.send({ message: "Hello swagger appi" });
});
app.use("/api/v1", authrouter);

app.use(validationError);

// ✅ Corrected listen usage
const server = app.listen(port, () => {
  console.log(`Auth service is running on http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/docs`);
});

server.on("error", (error) => {
  console.error("Server Error", error);
});
