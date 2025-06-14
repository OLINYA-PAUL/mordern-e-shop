import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT) ?? Number("6379"),
  password: process.env.REDIS_PASSWORD ?? "password",
});
