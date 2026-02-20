import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@clerk/nextjs/server";

declare global {
  var JOB_STORE: any[];
}

if (!global.JOB_STORE) {
  global.JOB_STORE = [];
}

function pickOutput(format: string, inputMime: string) {
  if (format && format !== "auto") return format;
  if (inputMime.includes("png")) return "png";
  if (inputMime.includes("webp")) return "webp";
  if (inputMime.includes("avif")) return "avif";
  return "jpg";
}

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

    const formatRaw = String(
      form.get("format") ?? "auto"
    );

    const inputBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const outputFormat = pickOutput(
      formatRaw,
      file.type
    );

    let outputBuffer: Buffer;

    if (outputFormat === "png") {
      outputBuffer = await sharp(inputBuffer)
        .png({ quality: 80 })
        .toBuffer();
    } else if (outputFormat === "webp") {
      outputBuffer = await sharp(inputBuffer)
        .webp({ quality: 80 })
        .toBuffer();
    } else if (outputFormat === "avif") {
      outputBuffer = await sharp(inputBuffer)
        .avif({ quality: 50 })
        .toBuffer();
    } else {
      outputBuffer = await sharp(inputBuffer)
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const id = crypto.randomUUID();

    const job = {
      id,
      userId,
      fileName: file.name,
      originalBytes: inputBuffer.length,
      compressedBytes: outputBuffer.length,
      savingsPercent:
        Math.round(
          (1 -
            outputBuffer.length /
              inputBuffer.length) *
            100
        ),
      createdAt: new Date().toISOString(),
      downloadUrl: "#",
    };

    global.JOB_STORE.unshift(job);

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": file.type,
      },
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: "Compression failed" },
      { status: 500 }
    );
  }
}