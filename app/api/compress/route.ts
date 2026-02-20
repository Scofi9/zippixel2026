import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth, createClerkClient } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";
import { PLANS, type PlanKey } from "@/lib/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Job = {
  id: string;
  userId: string;
  fileName: string;
  outputFormat: "WEBP";
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

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    const outputBuffer = await sharp(inputBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    const id = crypto.randomUUID();

    // TEMP çözüm: download endpoint üzerinden indirecek
    const outputUrl = `/api/download?id=${id}`;

    const job: Job = {
      id,
      userId,
      fileName: file.name,
      outputFormat: "WEBP",
      originalBytes: inputBuffer.length,
      compressedBytes: outputBuffer.length,
      savingsPercent: Math.round((1 - outputBuffer.length / inputBuffer.length) * 100),
      createdAt: Date.now(),
      outputUrl,
    };

    // Redis'e history listesine ekle
    await redis.lpush(`jobs:${userId}`, JSON.stringify(job));

    // Redis'e tekil kayıt ekle (download endpoint için)
    await redis.set(`job:${userId}:${id}`, JSON.stringify(job));

    // Redis'e file buffer kaydet (base64)
    await redis.set(`file:${userId}:${id}`, outputBuffer.toString("base64"), {
      ex: 60 * 60 * 24, // 24 saat sakla
    });

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "image/webp",
        "Content-Disposition": `attachment; filename="compressed-${file.name}.webp"`,
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
