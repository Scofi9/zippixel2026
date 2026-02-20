import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth, createClerkClient } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";
import { PLANS, type PlanKey } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OutputFormat = "ORIGINAL" | "JPEG" | "PNG" | "WEBP" | "AVIF";

type Job = {
  id: string;
  userId: string;
  fileName: string;
  outputFormat: OutputFormat;
  originalBytes: number;
  compressedBytes: number;
  savingsPercent: number;
  createdAt: number;
  outputUrl: string;
};

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function safePlanKey(raw: any): PlanKey {
  return (["free", "basic", "pro", "plus"] as const).includes(raw) ? raw : "free";
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Premium: slider “50” = encoder’a direkt 50 vermiyoruz.
// Görseli “çok bozmadan” daha iyi sıkıştırma için perceptual curve.
function perceptualQuality(uiQ: number) {
  const q = clamp(Math.round(uiQ), 1, 100);
  // 1..100 -> 35..92 gibi davranır (daha premium görüntü)
  // 50 -> ~68, 80 -> ~87
  return clamp(Math.round(35 + q * 0.57), 35, 92);
}

function pickRequestedFormat(raw: any) {
  const f = String(raw ?? "auto").toLowerCase();
  if (f === "jpg" || f === "jpeg") return "jpeg";
  if (f === "png") return "png";
  if (f === "webp") return "webp";
  if (f === "avif") return "avif";
  return "auto";
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

export async function POST(req: Request) {
  try {
    const redis = getRedis();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Limit check (Clerk metadata) - heavy work yapmadan önce
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const user = await clerk.users.getUser(userId);
    const md = (user.publicMetadata ?? {}) as Record<string, any>;

    const planKey = safePlanKey(md.plan);
    const limit = PLANS[planKey].monthlyLimitImages;

    const keyNow = monthKey();
    const keyStored = (md.usageMonthKey as string) ?? keyNow;

    let usage = Number(md.usageThisMonth ?? 0) || 0;
    if (keyStored !== keyNow) usage = 0;
    if (limit > 0) usage = Math.min(usage, limit);

    if (limit > 0 && usage >= limit) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", usageThisMonth: usage, limit, plan: planKey },
        { status: 403 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uiQualityRaw = Number(form.get("quality") ?? 80);
    const uiQuality = clamp(Number.isFinite(uiQualityRaw) ? uiQualityRaw : 80, 1, 100);
    const q = perceptualQuality(uiQuality);

    const requested = pickRequestedFormat(form.get("format"));

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    // Premium: orientation fix + sRGB (metadata tutulmadan)
    const base = sharp(inputBuffer, { failOn: "none" })
      .rotate()
      .toColorspace("srgb");

    const meta = await base.metadata();
    const hasAlpha = Boolean(meta.hasAlpha);

    // Helper: candidate üret
    const candidates: Array<{ fmt: OutputFormat; buf: Buffer }> = [];

    // Kullanıcı PNG isterse: PNG optimizasyonu (lossless)
    if (requested === "png") {
      const pngBuf = await base
        .png({
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true,
        })
        .toBuffer();
      candidates.push({ fmt: "PNG", buf: pngBuf });
    }

    // Kullanıcı JPEG isterse: mozjpeg (lossy)
    if (requested === "jpeg") {
      // Alpha varsa jpeg yaparsak transparanlık gider -> o yüzden alpha varsa webp/avif’a düşelim
      if (!hasAlpha) {
        const jpgBuf = await base
          .jpeg({
            quality: q,
            mozjpeg: true,
            progressive: true,
            chromaSubsampling: "4:2:0",
          })
          .toBuffer();
        candidates.push({ fmt: "JPEG", buf: jpgBuf });
      }
    }

    // WEBP
    if (requested === "webp" || requested === "auto" || requested === "jpeg") {
      const webpBuf = await base
        .webp({
          quality: q,
          effort: 6, // max webp effort
          smartSubsample: true,
          // q yüksekken yakın-lossless davran (kaliteyi çok koru)
          nearLossless: q >= 86 ? true : false,
        })
        .toBuffer();
      candidates.push({ fmt: "WEBP", buf: webpBuf });
    }

    // AVIF (çoğu fotoğrafta inanılmaz kazanç)
    if (requested === "avif" || requested === "auto") {
      try {
        const avifBuf = await base
          .avif({
            quality: q,
            effort: 7, // iyi sıkıştırma, makul CPU
            chromaSubsampling: "4:2:0",
          })
          .toBuffer();
        candidates.push({ fmt: "AVIF", buf: avifBuf });
      } catch {
        // bazı sharp build’lerinde avif kapalı olabilir -> sessizce geç
      }
    }

    // Auto seçimi: en küçük buffer’ı seç
    // Eğer candidate yoksa (uç case), webp fallback
    if (candidates.length === 0) {
      const fallback = await base.webp({ quality: q, effort: 6 }).toBuffer();
      candidates.push({ fmt: "WEBP", buf: fallback });
    }

    candidates.sort((a, b) => a.buf.length - b.buf.length);
    let best = candidates[0];

    // Premium davranış: çıktı ASLA orijinalden büyük dönmesin.
    // (zaten optimize edilmiş dosyalarda encoder bazen büyütebilir)
    if (best.buf.length >= inputBuffer.length) {
      best = { fmt: "ORIGINAL", buf: inputBuffer };
    }

    const id = crypto.randomUUID();
    const outputUrl = `/api/download?id=${id}`;

    const job: Job = {
      id,
      userId,
      fileName: file.name,
      outputFormat: best.fmt,
      originalBytes: inputBuffer.length,
      compressedBytes: best.buf.length,
      savingsPercent: Math.max(0, Math.round((1 - best.buf.length / inputBuffer.length) * 100)),
      createdAt: Date.now(),
      outputUrl,
    };

    await redis.lpush(`jobs:${userId}`, JSON.stringify(job));
    await redis.set(`job:${userId}:${id}`, JSON.stringify(job));
    await redis.set(`file:${userId}:${id}`, best.buf.toString("base64"), {
      ex: 60 * 60 * 24,
    });

    const ext = extFor(best.fmt);
    const ct = contentTypeFor(best.fmt);

    const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
    const baseName = safeName.replace(/\.[^/.]+$/, "");
    const outName = best.fmt === "ORIGINAL" ? safeName : `zippixel-${baseName}.${ext}`;

    return new NextResponse(best.buf, {
      headers: {
        "Content-Type": ct,
        "Content-Disposition": `attachment; filename="${outName}"`,
        "X-Output-Format": best.fmt,
        "X-Quality-UI": String(uiQuality),
        "X-Quality-Encoder": String(q),
      },
    });
  } catch (err: any) {
    console.error("Compress error:", err);
    return NextResponse.json(
      { error: "Compression failed", detail: err?.message },
      { status: 500 }
    );
  }
}