import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dayKey(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function hashVisitor(ip: string, ua: string) {
  // Server-side hash; never store raw IP/UA.
  return crypto.createHash("sha256").update(`${ip}|${ua}`).digest("hex").slice(0, 32);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { path?: string };
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";

    const h = await headers();
    const ua = (h.get("user-agent") || "").slice(0, 200);
    const ip = (
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "0.0.0.0"
    ).slice(0, 64);

    // Auth is optional for tracking.
    let userId: string | null = null;
    try {
      const a = await auth();
      userId = a.userId || null;
    } catch {
      userId = null;
    }

    const dk = dayKey();
    const visitorId = hashVisitor(ip, ua);

    const redis = getRedis();

    const pvKey = `analytics:pv:${dk}`;
    const uvKey = `analytics:uv:${dk}`;
    const loginKey = `analytics:login:${dk}`;
    const totalPvKey = "analytics:pv:total";
    const totalLoginKey = "analytics:login:total";
    const eventsKey = "analytics:events";
    const adminEventsKey = "admin:events";

    const now = Date.now();
    const event = {
      t: now,
      path,
      in: Boolean(userId),
    };

    const adminEvent = {
      t: now,
      type: "pageview",
      path,
      in: Boolean(userId),
      userId: userId || null,
    };

    const ops: Promise<any>[] = [];
    ops.push(redis.incr(pvKey));
    ops.push(redis.incr(totalPvKey));
    ops.push(redis.sadd(uvKey, visitorId));
    ops.push(redis.lpush(eventsKey, JSON.stringify(event)));
    ops.push(redis.ltrim(eventsKey, 0, 199));
    ops.push(redis.lpush(adminEventsKey, JSON.stringify(adminEvent)));
    ops.push(redis.ltrim(adminEventsKey, 0, 199));

    if (userId) {
      ops.push(redis.incr(loginKey));
      ops.push(redis.incr(totalLoginKey));
    }

    await Promise.allSettled(ops);
    return NextResponse.json({ ok: true });
  } catch {
    // Never fail the page because of analytics.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
