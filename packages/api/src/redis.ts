import { createClient, RedisClientType } from "redis";

// Creating a typed connection
const redisClient: RedisClientType = createClient({
  url: "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD, // Good practice: use environment variables
});

// Connecting to the Redis server
async function connectRedis(): Promise<void> {
  await redisClient.connect();
  console.log("Successfully connected to Redis");
}
// Error handling
redisClient.on("error", (err: Error) => {
  console.error("Redis connection error:", err);
});

connectRedis().catch(console.error);

export default redisClient;

// things we need

// first startup, cache empty: redis talk to mongdb
// & grabs data of last 3 edited for current user
// returns frontend & stores in redis

// when user logs out, update mongodb & clear redis cache

// when user makes changes, update redis cache
