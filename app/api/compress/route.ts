import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = crypto.randomUUID() + ".webp";
    const outputDir = path.join(process.cwd(), "public", "compressed");

    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, filename);

    await sharp(buffer)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const originalSize = buffer.length;
    const compressedSize = (await fs.stat(outputPath)).size;

    return NextResponse.json({
      url: `/compressed/${filename}`,
      originalSize,
      compressedSize,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Compression failed" }, { status: 500 });
  }
}