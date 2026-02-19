import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    const qualityRaw = form.get("quality")?.toString() ?? "80";
    const formatRaw = (form.get("format")?.toString() ?? "auto") as
      | "auto"
      | "jpg"
      | "png"
      | "webp"
      | "avif";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const quality = Math.max(10, Math.min(100, Number(qualityRaw) || 80));
    const input = Buffer.from(await file.arrayBuffer());

    let img = sharp(input).rotate();

    const outFormat = formatRaw === "auto" ? "webp" : formatRaw;

    let out: Buffer;
    let contentType = "image/webp";
    let ext = "webp";

    if (outFormat === "jpg") {
      out = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
      contentType = "image/jpeg";
      ext = "jpg";
    } else if (outFormat === "png") {
      out = await img.png({ quality }).toBuffer();
      contentType = "image/png";
      ext = "png";
    } else if (outFormat === "avif") {
      out = await img.avif({ quality }).toBuffer();
      contentType = "image/avif";
      ext = "avif";
    } else {
      out = await img.webp({ quality }).toBuffer();
      contentType = "image/webp";
      ext = "webp";
    }

    const baseName = (file.name || "image").replace(/\.[^/.]+$/, "");
    const downloadName = `${baseName}.compressed.${ext}`;

    return new NextResponse(out, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Cache-Control": "no-store",

        // frontend için metalar
        "X-Original-Size": String(input.length),
        "X-Compressed-Size": String(out.length),
        "X-Filename": downloadName,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Compression failed" },
      { status: 500 }
    );
  }
}