import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

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


const ip = getClientIp(req);
const rl = await rateLimit({
  key: userId ? `dl:u:${userId}` : `dl:ip:${ip}`,
  limit: userId ? 240 : 60,
  windowSeconds: 60,
});

if (!rl.ok) {
  return NextResponse.json(
    { error: "RATE_LIMITED", resetSeconds: rl.resetSeconds, limit: rl.limit },
    { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
  );
}


    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const redis = getRedis();

    // 1) job key
    let raw: any = await redis.get(`job:${userId}:${id}`);

    // 2) yoksa history listeden bul
    if (!raw) {
      const list: any[] = await redis.lrange(`jobs:${userId}`, 0, 200);

      const found = list.find((x: any) => {
        try {
          const j = typeof x === "string" ? JSON.parse(x) : x;
          return j?.id === id;
        } catch {
          return false;
        }
      });

      if (found) {
        raw = found;
        // job key olarak da yaz (stringle)
        const toStore = typeof found === "string" ? found : JSON.stringify(found);
        await redis.set(`job:${userId}:${id}`, toStore);
      }
    }

    if (!raw) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // raw string ya da object olabilir
    const job: Job = typeof raw === "string" ? JSON.parse(raw) : raw;

    // 3) file base64
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