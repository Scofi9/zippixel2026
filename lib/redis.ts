import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Upstash env missing: UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN. Vercel'de Preview + Production envlerini kontrol et."
    );
  }

  if (!_redis) {
    _redis = new Redis({ url, token });
  }

  return _redis;
}