import Redis from "ioredis";

// export const redis = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: parseInt(process.env.REDIS_PORT || "6379"),
//   password:
//     process.env.REDIS_PASSWORD ||
//     "AcMCAAIjcDFiZDgzMGZiZDRmZGQ0OGIzODNjZTBlY2NkYjhjOGVjYXAxMA",
//   retryStrategy: (times) => {
//     if (times >= 5) return null;
//     return Math.min(times * 100, 3000);
//   },
//   maxRetriesPerRequest: 5,
// });

export const redis = new Redis(process.env.REDIS_URL!);

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});
