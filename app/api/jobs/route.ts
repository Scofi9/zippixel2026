import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ jobs: [] });
  }

  const jobs = await redis.lrange(`jobs:${userId}`, 0, 100);

  return NextResponse.json({
    jobs: jobs.map((j: any) => JSON.parse(j)),
  });
}