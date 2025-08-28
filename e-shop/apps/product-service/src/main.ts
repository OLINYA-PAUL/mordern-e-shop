import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validationError } from '../../../packages/error-handler/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import router from "./routes/product.routes"
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
const port = process.env.PORT ? Number(process.env.PORT) : 6002;

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/docs-json', (req: Request, res: Response) => {
  res.send(swaggerDocument);
});

app.use("/api", router)
app.use(validationError);

// ✅ Start server
const server = app.listen(port, () => {
  console.log(`✅ Product service running at http://localhost:${port}/api`);
  console.log(`📘 Product Swagger Docs at http://localhost:${port}/swagger-api-docs`);
});

server.on('error', (error) => {
  console.error('❌ Server Error', error);
});
