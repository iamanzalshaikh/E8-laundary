import { Redis } from "ioredis";
import config from "./config.js";
import logger from "./logger.js";

const redis = new Redis(config.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => {
  logger.info("Connected to Redis successfully");
});

redis.on("error", (err) => {
  logger.error("Redis Connection Error:", err);
});

export default redis;
