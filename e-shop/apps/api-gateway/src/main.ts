/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import { rateLimit } from 'express-rate-limit';
import { initialSiteConfig } from './libs/initialSiteConfig';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
  })
);

app.use(express.json({ limit: '100mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req: any) => (req.user ? 1000 : 100),
  message: { error: 'Too many requests. Please try again later.' },
  keyGenerator: (req: any) => req.ip,
  legacyHeaders: true,
  standardHeaders: true,
});

// Apply rate limiter before proxy routes
app.use(limiter);

app.get('/gateway-health', (req, res) => {
  res.send({ message: 'Welcome to api-gateway!' });
});

// Proxy all requests to the actual service
// app.use("/", proxy("http://localhost:6001/api/v1"));

app.use(
  '/',
  proxy('http://localhost:6001', {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);
app.use(
  '/products',
  proxy('http://localhost:6002', {
    proxyReqPathResolver: (req) => req.originalUrl,
  })
);


const port = process.env.PORT || 8080;
const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}/api`);
  try {
    await initialSiteConfig();
  } catch (error) {
    console.log(error);
  }
});
server.on('error', console.error);
