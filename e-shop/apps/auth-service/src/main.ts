// import express, { Request, Response } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { validationError } from "../../../packages/error-handler/errorMiddleware";
// import authrouter from "./routes/user.routes";
// import swaggerUi from "swagger-ui-express";
// const swaggerDocument = require("./swagger-output.json");

// const app = express();

// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     allowedHeaders: ["Authorization", "Content-Type"],
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "100mb" }));
// app.use(cookieParser());
// const port = process.env.PORT ? Number(process.env.PORT) : 6001;

// app.get("/", (req, res) => {
//   res.send({ message: "Hello API" });
// });

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get("/docs-json", (req: Request, res: Response) => {
//   res.send(swaggerDocument);
// });
// app.use("/api/v1", authrouter);

// app.use(validationError);

// // ✅ Corrected listen usage
// const server = app.listen(port, () => {
//   console.log(`Auth service is running on http://localhost:${port}/api`);
//   console.log(`Swagger Docs available at http://localhost:${port}/docs`);
// });

// server.on("error", (error) => {
//   console.error("Server Error", error);
// });

// =================================================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validationError } from '../../../packages/error-handler/errorMiddleware';
import authrouter from './routes/user.routes';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const app = express();

// Optional Swagger file loading
const swaggerPath = path.join(__dirname, '..', 'swagger-output.json');
let swaggerDocument: any = null;

if (fs.existsSync(swaggerPath)) {
  swaggerDocument = require(swaggerPath);
  console.log('✅ Swagger loaded successfully.');
} else {
  console.warn('⚠️ Swagger file not found. Skipping Swagger UI.');
}

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
const port = process.env.PORT ? Number(process.env.PORT) : 6001;

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req: Request, res: Response) => {
  res.send(swaggerDocument);
});

app.use('/api/v1', authrouter);
app.use(validationError);

// ✅ Start server
const server = app.listen(port, () => {
  console.log(`✅ Auth service running at http://localhost:${port}/api`);
  console.log(`📘 Swagger Docs at http://localhost:${port}/swagger-api-docs`);
});

server.on('error', (error) => {
  console.error('❌ Server Error', error);
});
