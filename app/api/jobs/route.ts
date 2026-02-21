import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {let userId: string | null = null;
  try {
    ({ userId } = await auth());
  } catch (e: any) {
    console.error("auth error:", e?.message || e);
    userId = null;
  }
if (!userId) {
    return NextResponse.json({ jobs: [] });
  }

  const redis = getRedis();
  const raw = await redis.lrange(`jobs:${userId}`, 0, 100);

  const jobs = raw.map((j: any) => (typeof j === "string" ? JSON.parse(j) : j));

  return NextResponse.json({ jobs });
}