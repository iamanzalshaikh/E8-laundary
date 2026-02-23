import { Redis } from "ioredis";
import config from "./config.js";
import logger from "./logger.js";

/** In-memory store with TTL for when Redis is not configured (e.g. Render without Redis add-on) */
const createMemoryStore = () => {
  const store = new Map<string, { value: string; expiresAt: number }>();
  const get = async (key: string): Promise<string | null> => {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.value;
  };
  const set = async (key: string, value: string, ...args: unknown[]): Promise<"OK"> => {
    const ex = args[0] === "EX" ? Number(args[1]) : 0;
    store.set(key, {
      value,
      expiresAt: ex ? Date.now() + ex * 1000 : Date.now() + 600_000,
    });
    return "OK";
  };
  const del = async (key: string): Promise<number> => {
    return store.delete(key) ? 1 : 0;
  };
  return { get, set, del } as RedisLike;
};

type RedisLike = Pick<Redis, "get" | "set" | "del">;

const isRedisConfigured = () => {
  const url = config.REDIS_URL?.trim();
  if (!url) return false;
  try {
    const u = new URL(url);
    const isLocal = u.hostname === "localhost" || u.hostname === "127.0.0.1" || u.hostname === "::1";
    if (isLocal && config.NODE_ENV === "production") return false;
  } catch {
    return false;
  }
  return true;
};

let redis: RedisLike;

if (isRedisConfigured()) {
  redis = new Redis(config.REDIS_URL!);
  redis.on("connect", () => {
    logger.info("Connected to Redis successfully");
  });
  redis.on("error", (err) => {
    logger.error("Redis Connection Error:", err);
  });
} else {
  if (config.NODE_ENV === "production") {
    logger.warn("REDIS_URL not set or localhost in production — using in-memory store (OTP/cache not shared across instances)");
  }
  redis = createMemoryStore();
}

export default redis;
