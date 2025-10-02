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

// Features Left:
// Frontend integration
// Fix overall logic of documents being replaced for studies (wording to keep things consistent)
// Read over the studies and auth routes logic to check for any possible mistakes
