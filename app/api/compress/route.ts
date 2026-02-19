import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

function pickOutput(format: string, inputMime: string) {
  if (format && format !== "auto") return format;
  if (inputMime.includes("png")) return "png";
  if (inputMime.includes("webp")) return "webp";
  if (inputMime.includes("avif")) return "avif";
  return "jpg";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const qualityRaw = String(form.get("quality") ?? "80");
    const quality = Math.max(10, Math.min(100, Number(qualityRaw) || 80));

    const formatRaw = String(form.get("format") ?? "auto").toLowerCase();
    const out = pickOutput(formatRaw, file.type);

    const inputBuffer = Buffer.from(await file.arrayBuffer());

    let img = sharp(inputBuffer, { failOn: "none" });

    let outBuffer: Buffer;
    let contentType = "image/jpeg";
    let ext = "jpg";

    if (out === "png") {
      outBuffer = await img.png({ quality }).toBuffer();
      contentType = "image/png";
      ext = "png";
    } else if (out === "webp") {
      outBuffer = await img.webp({ quality }).toBuffer();
      contentType = "image/webp";
      ext = "webp";
    } else if (out === "avif") {
      outBuffer = await img.avif({ quality }).toBuffer();
      contentType = "image/avif";
      ext = "avif";
    } else {
      outBuffer = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
      contentType = "image/jpeg";
      ext = "jpg";
    }

    const baseName = (file.name || "image").replace(/\.[^.]+$/, "");
    const outName = `${baseName}-compressed.${ext}`;

    return new NextResponse(outBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${outName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Compression failed", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}