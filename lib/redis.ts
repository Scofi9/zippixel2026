import { Redis } from "@upstash/redis";

/**
 * Create a Redis client from environment variables.
 *
 * IMPORTANT:
 * - We intentionally DO NOT cache the client globally. In long-running Next.js servers,
 *   stale env / token rotations can otherwise keep an old client alive.
 * - We also trim values to avoid hidden whitespace issues.
 */
export function getRedis() {
  const url = (
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.KV_URL ||
    ""
  ).trim();

  const token = (
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    ""
  ).trim();

  if (!url || !token) {
    throw new Error(
      "Redis env missing. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL + KV_REST_API_TOKEN)."
    );
  }

  return new Redis({ url, token });
}
