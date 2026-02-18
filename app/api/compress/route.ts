import { NextResponse } from "next/server"
import sharp from "sharp"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const qualityRaw = form.get("quality")?.toString() ?? "80"
    const format = (form.get("format")?.toString() ?? "auto") as
      | "auto"
      | "jpg"
      | "png"
      | "webp"
      | "avif"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const quality = Math.max(10, Math.min(100, Number(qualityRaw) || 80))

    const arrayBuffer = await file.arrayBuffer()
    const input = Buffer.from(arrayBuffer)

    let image = sharp(input).rotate()

    // Auto format: webp tercih edelim (hafif olur)
    const outFormat = format === "auto" ? "webp" : format

    let out: Buffer
    let contentType = "image/webp"
    let ext = "webp"

    if (outFormat === "jpg") {
      out = await image.jpeg({ quality, mozjpeg: true }).toBuffer()
      contentType = "image/jpeg"
      ext = "jpg"
    } else if (outFormat === "png") {
      out = await image.png({ quality }).toBuffer()
      contentType = "image/png"
      ext = "png"
    } else if (outFormat === "webp") {
      out = await image.webp({ quality }).toBuffer()
      contentType = "image/webp"
      ext = "webp"
    } else if (outFormat === "avif") {
      out = await image.avif({ quality }).toBuffer()
      contentType = "image/avif"
      ext = "avif"
    } else {
      out = await image.webp({ quality }).toBuffer()
    }

    // Dosya adı
    const baseName = (file.name || "image").replace(/\.[^/.]+$/, "")
    const downloadName = `${baseName}.compressed.${ext}`

    return new NextResponse(out, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Compression failed" },
      { status: 500 }
    )
  }
}