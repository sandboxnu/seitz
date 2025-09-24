import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  // password: process.env.REDIS_PASSWORD // uncomment if needed
});

async function connectRedis(): Promise<void> {
  await redisClient.connect();
  console.log("Successfully connected to Redis");
}

redisClient.on("ready", () => {
  console.log("Redis client ready");
});

redisClient.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

connectRedis().catch(console.error);

export default redisClient;

// things we need

// first startup, cache empty: redis talk to mongdb
// & grabs data of last 3 edited for current user
// returns frontend & stores in redis

// when user logs out, update mongodb & clear redis cache

// when user makes changes, update redis cache
