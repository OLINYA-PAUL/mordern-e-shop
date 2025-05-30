import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../../../packages/error-handler/errorMiddleware";

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

app.use(errorMiddleware);

// ✅ Corrected listen usage
const server = app.listen(port, () => {
  console.log(`Auth service is running on http://localhost:${port}/api`);
});

server.on("error", (error) => {
  console.error("Server Error", error);
});
