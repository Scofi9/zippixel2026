import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Simple healthcheck to confirm the running Next.js process can authenticate to Upstash.
 * GET /api/redis-ping
 */
export async function GET() {
  try {
    const redis = getRedis();
    // @upstash/redis supports `ping()`; if not, fall back to a no-op set/get.
    const result = (redis as any).ping ? await (redis as any).ping() : "OK";
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "unknown" },
      { status: 500 }
    );
  }
}
