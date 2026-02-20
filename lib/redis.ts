import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis() {
  // Öncelik: Upstash Redis (senin kullandığın)
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || process.env.KV_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Redis env missing. Set either UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN OR KV_REST_API_URL + KV_REST_API_TOKEN."
    );
  }

  if (!_redis) _redis = new Redis({ url, token });
  return _redis;
}