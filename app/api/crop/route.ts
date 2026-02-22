import { NextResponse } from "next/server";
import sharp from "sharp";
import crypto from "crypto";
import { auth, createClerkClient } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { PLANS, type PlanKey } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OutputFormat = "ORIGINAL" | "JPEG" | "PNG" | "WEBP" | "AVIF";

type CropJob = {
  id: string;
  userId: string | null;
  action: "crop";
  fileName: string;
  outputFormat: OutputFormat;
  originalBytes: number;
  outputBytes: number;
  savingsPercent: number;
  createdAt: number;
  outputUrl: string;
  crop: { x: number; y: number; width: number; height: number; rotation: number };
  outputFileName?: string;
};

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function dayKey(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function safePlanKey(raw: any): PlanKey {
  return (['free', 'basic', 'pro', 'plus'] as const).includes(raw) ? raw : 'free';
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function contentTypeFor(fmt: OutputFormat) {
  if (fmt === "AVIF") return "image/avif";
  if (fmt === "WEBP") return "image/webp";
  if (fmt === "JPEG") return "image/jpeg";
  if (fmt === "PNG") return "image/png";
  return "application/octet-stream";
}

function extFor(fmt: OutputFormat) {
  if (fmt === "AVIF") return "avif";
  if (fmt === "WEBP") return "webp";
  if (fmt === "JPEG") return "jpg";
  if (fmt === "PNG") return "png";
  return "bin";
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-() ]+/g, "_");
}

function guessOriginalOutput(file: File): OutputFormat {
  const t = (file.type || "").toLowerCase();
  if (t.includes("png")) return "PNG";
  if (t.includes("webp")) return "WEBP";
  if (t.includes("avif")) return "AVIF";
  if (t.includes("jpeg") || t.includes("jpg")) return "JPEG";
  return "ORIGINAL";
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const ip = getClientIp(req);
    const rl = await rateLimit({
      key: userId ? `crop:u:${userId}` : `crop:ip:${ip}`,
      limit: userId ? 90 : 20,
      windowSeconds: 60,
    });

    if (!rl.ok) {
      return NextResponse.json(
        { error: "RATE_LIMITED", resetSeconds: rl.resetSeconds, limit: rl.limit },
        { status: 429, headers: { "Retry-After": String(rl.resetSeconds) } }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const x = Number(form.get("x"));
    const y = Number(form.get("y"));
    const width = Number(form.get("width"));
    const height = Number(form.get("height"));
    const rotation = clamp(Number(form.get("rotation") ?? 0) || 0, 0, 360);

    if (![x, y, width, height].every((n) => Number.isFinite(n))) {
      return NextResponse.json({ error: "Invalid crop params" }, { status: 400 });
    }

    const requestedFmtRaw = String(form.get("format") ?? "webp").toLowerCase();
    const qualityRaw = Number(form.get("quality") ?? 90);
    const quality = clamp(Number.isFinite(qualityRaw) ? qualityRaw : 90, 40, 95);

    // Plan checks
    let planKey: PlanKey = "free";
    let limit = 0;
    let usage = 0;

    if (userId && process.env.CLERK_SECRET_KEY) {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const user = await clerk.users.getUser(userId);
      const md = (user.publicMetadata ?? {}) as Record<string, any>;

      planKey = safePlanKey(md.plan);
      limit = PLANS[planKey].monthlyLimitImages;

      const keyNow = monthKey();
      const keyStored = (md.usageMonthKey as string) ?? keyNow;
      usage = Number(md.usageThisMonth ?? 0) || 0;
      if (keyStored !== keyNow) usage = 0;
      if (limit > 0) usage = Math.min(usage, limit);

      if (limit > 0 && usage >= limit) {
        return NextResponse.json(
          { error: "LIMIT_REACHED", usageThisMonth: usage, limit, plan: planKey },
          { status: 403 }
        );
      }
    }

    // Max file size (signed-out treated as Free)
    const maxMb = userId ? PLANS[planKey].maxFileMb : PLANS.free.maxFileMb;
    const maxBytes = maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "FILE_TOO_LARGE", maxMb }, { status: 413 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const base = sharp(inputBuffer, { failOn: "none" }).rotate();

    // Apply rotation from UI (additional)
    const rotated = rotation ? base.rotate(rotation) : base;
    const meta = await rotated.metadata();

    const imgW = meta.width ?? 0;
    const imgH = meta.height ?? 0;

    const left = clamp(Math.round(x), 0, Math.max(0, imgW - 1));
    const top = clamp(Math.round(y), 0, Math.max(0, imgH - 1));
    const w = clamp(Math.round(width), 1, Math.max(1, imgW - left));
    const h = clamp(Math.round(height), 1, Math.max(1, imgH - top));

    const extracted = rotated.extract({ left, top, width: w, height: h }).toColorspace("srgb");

    let outFmt: OutputFormat = "WEBP";
    if (requestedFmtRaw === "original") outFmt = guessOriginalOutput(file);
    else if (requestedFmtRaw === "jpg" || requestedFmtRaw === "jpeg") outFmt = "JPEG";
    else if (requestedFmtRaw === "png") outFmt = "PNG";
    else if (requestedFmtRaw === "webp") outFmt = "WEBP";
    else if (requestedFmtRaw === "avif") outFmt = "AVIF";
    else outFmt = "WEBP";

    let outBuf: Buffer;

    if (outFmt === "PNG") {
      outBuf = await extracted.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
    } else if (outFmt === "JPEG") {
      outBuf = await extracted.jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" }).toBuffer();
    } else if (outFmt === "AVIF") {
      try {
        outBuf = await extracted.avif({ quality, effort: 6, chromaSubsampling: "4:2:0" }).toBuffer();
      } catch {
        outFmt = "WEBP";
        outBuf = await extracted.webp({ quality, effort: 6 }).toBuffer();
      }
    } else if (outFmt === "ORIGINAL") {
      // If we don't know the original type, default to WEBP.
      if (guessOriginalOutput(file) === "ORIGINAL") {
        outFmt = "WEBP";
        outBuf = await extracted.webp({ quality, effort: 6 }).toBuffer();
      } else {
        // Re-encode as the original mime type.
        const guess = guessOriginalOutput(file);
        if (guess === "PNG") outBuf = await extracted.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
        else if (guess === "JPEG") outBuf = await extracted.jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: "4:2:0" }).toBuffer();
        else if (guess === "WEBP") outBuf = await extracted.webp({ quality, effort: 6 }).toBuffer();
        else if (guess === "AVIF") {
          try {
            outBuf = await extracted.avif({ quality, effort: 6, chromaSubsampling: "4:2:0" }).toBuffer();
          } catch {
            outBuf = await extracted.webp({ quality, effort: 6 }).toBuffer();
            outFmt = "WEBP";
          }
        } else {
          outBuf = await extracted.webp({ quality, effort: 6 }).toBuffer();
          outFmt = "WEBP";
        }
        outFmt = guess;
      }
    } else {
      // WEBP
      outBuf = await extracted.webp({ quality, effort: 6 }).toBuffer();
    }

    const id = crypto.randomUUID();
    const outputUrl = `/api/download?id=${id}`;

    const safeName = safeFileName(file.name);
    const baseName = safeName.replace(/\.[^/.]+$/, "");
    const ext = extFor(outFmt);
    const outName = `zippixel-crop-${baseName}.${ext}`;

    const originalBytes = inputBuffer.length;
    const savedBytes = Math.max(0, originalBytes - outBuf.length);
    const savingsPercent = Math.max(0, Math.round((1 - outBuf.length / originalBytes) * 100));

    const job: CropJob = {
      id,
      userId: userId || null,
      action: "crop",
      fileName: safeName,
      outputFormat: outFmt,
      originalBytes,
      outputBytes: outBuf.length,
      savingsPercent,
      createdAt: Date.now(),
      outputUrl,
      crop: { x: left, y: top, width: w, height: h, rotation },
      outputFileName: outName,
    };

    const redis = (() => {
      try {
        return getRedis();
      } catch {
        return null;
      }
    })();

    // Store history only when signed in.
    if (userId && redis) {
      try {
        await redis.lpush(`jobs:${userId}`, JSON.stringify(job));
        await redis.set(`job:${userId}:${id}`, JSON.stringify(job));
        await redis.set(`file:${userId}:${id}`, outBuf.toString("base64"), { ex: 60 * 60 * 24 });
      } catch {
        // ignore
      }
    }

    // Metrics + admin event feed
    if (redis) {
      try {
        const dk = dayKey();
        const ops: Promise<any>[] = [];
        ops.push(redis.incr("global:crops"));
        ops.push(redis.incr(`daily:crops:${dk}`));

        const adminEvent = {
          t: Date.now(),
          type: "crop",
          userId: userId || null,
          file: safeName,
          fmt: outFmt,
          originalBytes,
          outputBytes: outBuf.length,
          crop: { x: left, y: top, width: w, height: h, rotation },
        };
        ops.push(redis.lpush("admin:events", JSON.stringify(adminEvent)));
        ops.push(redis.ltrim("admin:events", 0, 199));

        await Promise.allSettled(ops);
      } catch {
        // ignore
      }
    }

    return new NextResponse(outBuf, {
      headers: {
        "Content-Type": contentTypeFor(outFmt),
        "Content-Disposition": `attachment; filename="${outName}"`,
        "Cache-Control": "no-store",
        "X-Output-Format": outFmt,
        "X-Quality": String(quality),
      },
    });
  } catch (err: any) {
    console.error("Crop error:", err);
    return NextResponse.json({ error: "Crop failed", detail: err?.message }, { status: 500 });
  }
}
