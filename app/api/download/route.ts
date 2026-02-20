import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Job = {
  id: string;
  fileName?: string;
  outputFormat?: string;
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const redis = getRedis();

    // 1) Önce direkt job key'inden dene
    let raw = await redis.get<string>(`job:${userId}:${id}`);

    // 2) Yoksa history listesinden bul (eski kayıtlar için)
    if (!raw) {
      const list = await redis.lrange(`jobs:${userId}`, 0, 200);
      const found = list.find((x: any) => {
        try {
          const j = typeof x === "string" ? JSON.parse(x) : x;
          return j?.id === id;
        } catch {
          return false;
        }
      });

      if (found) {
        raw = typeof found === "string" ? found : JSON.stringify(found);
        // bir daha "Not found" olmasın diye job key'ini de yaz
        await redis.set(`job:${userId}:${id}`, raw);
      }
    }

    if (!raw) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const job = JSON.parse(raw) as Job;

    // 3) Dosyayı Redis'ten çek (compress route bunu base64 kaydediyor)
    const b64 = await redis.get<string>(`file:${userId}:${id}`);
    if (!b64) {
      return NextResponse.json(
        { error: "File not found (expired). Re-compress and download again." },
        { status: 404 }
      );
    }

    const buffer = Buffer.from(b64, "base64");
    const safeName = (job.fileName || "image").replace(/[^\w.\-()\s]/g, "_");
    const ext = (job.outputFormat || "webp").toLowerCase();
    const filename = `compressed-${safeName}.${ext}`;

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": ext === "webp" ? "image/webp" : "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("Download error:", err);
    return NextResponse.json(
      { error: "Download failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}