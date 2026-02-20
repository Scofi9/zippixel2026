import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";
import path from "path";
import fs from "fs/promises";

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
  outputPath: string; // /storage/....
};

const STORAGE_DIR = process.env.STORAGE_DIR || "/var/www/zippixel-storage";
const STORAGE_PUBLIC_BASE =
  process.env.STORAGE_PUBLIC_BASE || "https://zippixel.xyz/storage";

function safeName(name: string) {
  return name.replace(/[^\w.\-()\s]/g, "_");
}

export async function POST(req: Request) {
  try {
    const redis = getRedis();

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const outputBuffer = await sharp(inputBuffer).webp({ quality: 80 }).toBuffer();

    const id = crypto.randomUUID();
    const outFileName = `${id}-${safeName(file.name)}.webp`;

    await fs.mkdir(STORAGE_DIR, { recursive: true });

    const absPath = path.join(STORAGE_DIR, outFileName);
    await fs.writeFile(absPath, outputBuffer);

    const publicUrl = `${STORAGE_PUBLIC_BASE}/${encodeURIComponent(outFileName)}`;

    const job: Job = {
      id,
      userId,
      fileName: file.name,
      outputFormat: "WEBP",
      originalBytes: inputBuffer.length,
      compressedBytes: outputBuffer.length,
      savingsPercent: Math.round((1 - outputBuffer.length / inputBuffer.length) * 100),
      createdAt: Date.now(),
      outputPath: publicUrl,
    };

    await redis.lpush(`jobs:${userId}`, JSON.stringify(job));
    await redis.set(`job:${userId}:${id}`, JSON.stringify(job));

    // compress ekranı için dosyayı response olarak da döndür (preview)
    return new NextResponse(outputBuffer, {
      headers: { "Content-Type": "image/webp" },
    });
  } catch (err: any) {
    console.error("Compress error:", err);
    return NextResponse.json(
      { error: "Compression failed", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}