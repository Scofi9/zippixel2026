import { getRedis } from "@/lib/redis";

export type RateLimitResult =
  | { ok: true; remaining: number; limit: number; resetSeconds: number }
  | { ok: false; remaining: 0; limit: number; resetSeconds: number };

/**
 * Simple fixed-window rate limiter using Upstash Redis.
 * If Redis is not configured, we allow the request (no hard failure).
 */
export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = opts;

  const redis = (() => {
    try {
      return getRedis();
    } catch {
      return null;
    }
  })();

  if (!redis) {
    return { ok: true, remaining: limit, limit, resetSeconds: windowSeconds };
  }

  const now = Math.floor(Date.now() / 1000);
  const windowId = Math.floor(now / windowSeconds);
  const redisKey = `rl:${key}:${windowId}`;

  const count = await redis.incr(redisKey);
  if (count === 1) {
    // expire slightly after the window ends
    await redis.expire(redisKey, windowSeconds + 5);
  }

  const remaining = Math.max(0, limit - count);
  const resetSeconds = (windowId + 1) * windowSeconds - now;

  if (count > limit) {
    return { ok: false, remaining: 0, limit, resetSeconds };
  }
  return { ok: true, remaining, limit, resetSeconds };
}

export function getClientIp(req: Request) {
  // Vercel/Next behind proxy
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
