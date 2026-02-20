// app/api/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredJob = {
  outputUrl?: string;   // varsa direkt buraya yönlendir
  outputPath?: string;  // eski isim/alternatif
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const redis = getRedis();
    const raw = await redis.get<string>(`job:${userId}:${id}`);
    if (!raw) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const job = JSON.parse(raw) as StoredJob;

    const url = job.outputUrl || job.outputPath;
    if (!url) {
      return NextResponse.json(
        { error: "No download URL saved for this job" },
        { status: 404 }
      );
    }

    return NextResponse.redirect(url);
  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Download failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}