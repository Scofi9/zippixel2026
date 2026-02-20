import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@clerk/nextjs/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File;

    const inputBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const outputBuffer = await sharp(inputBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    const job = {
      id: crypto.randomUUID(),
      userId,
      fileName: file.name,
      originalBytes: inputBuffer.length,
      compressedBytes: outputBuffer.length,
      savingsPercent: Math.round(
        (1 - outputBuffer.length / inputBuffer.length) * 100
      ),
      createdAt: Date.now(),
    };

    await redis.lpush(
      `jobs:${userId}`,
      JSON.stringify(job)
    );

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": "image/webp",
      },
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Compression failed" },
      { status: 500 }
    );

  }
}