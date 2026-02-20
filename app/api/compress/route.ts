import { NextResponse } from "next/server";
import sharp from "sharp";
import { auth } from "@clerk/nextjs/server";
import { addJob, saveFileForJob } from "@/lib/storage";

export const runtime = "nodejs";

function pickOutput(format: string, inputMime: string) {
  if (format && format !== "auto") return format;
  if (inputMime.includes("png")) return "png";
  if (inputMime.includes("webp")) return "webp";
  if (inputMime.includes("avif")) return "avif";
  return "jpg";
}

function extToMime(ext: string) {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
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
    let ext: "jpg" | "png" | "webp" | "avif" = "jpg";

    if (out === "png") {
      outBuffer = await img.png({ quality }).toBuffer();
      ext = "png";
    } else if (out === "webp") {
      outBuffer = await img.webp({ quality }).toBuffer();
      ext = "webp";
    } else if (out === "avif") {
      outBuffer = await img.avif({ quality }).toBuffer();
      ext = "avif";
    } else {
      outBuffer = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
      ext = "jpg";
    }

    const baseName = (file.name || "image").replace(/\.[^.]+$/, "");
    const outName = `${baseName}-compressed.${ext}`;

    // 1) Kullanıcı giriş yaptıysa: diske kaydet + history/files için kaydı ekle
    const { userId } = await auth();
    if (userId) {
      const id = crypto.randomUUID();
      const storedName = `${id}.${ext}`;

      await saveFileForJob(userId, storedName, outBuffer);

      const compressedSize = outBuffer.length;
      const inputBytes = inputBuffer.length;
      const savingsPercent =
        inputBytes > 0
          ? Math.max(0, Math.min(100, Math.round(((inputBytes - compressedSize) / inputBytes) * 100)))
          : 0;

      await addJob({
        id,
        userId,
        originalName: file.name || "image",
        storedName,
        inputBytes,
        outputBytes: compressedSize,
        outputFormat: ext,
        mime: extToMime(ext),
        savingsPercent,
      });
    }

    // 2) Response (şimdiki sistem bozulmasın): yine dosyayı döndürüyoruz
    return new NextResponse(outBuffer, {
      status: 200,
      headers: {
        "Content-Type": extToMime(ext),
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