import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content-type" }, { status: 415 });
    }

    const body = await req.json();
    const dataUrl = body?.dataUrl as string | undefined;
    const qRaw = body?.quality;
    const effortRaw = body?.effort;

    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Missing image dataUrl" }, { status: 400 });
    }

    const base64 = dataUrl.split(",")[1];
    if (!base64) {
      return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 });
    }

    const input = Buffer.from(base64, "base64");

    const quality = clamp(Number.isFinite(Number(qRaw)) ? Number(qRaw) : 65, 1, 100);
    const effort = clamp(Number.isFinite(Number(effortRaw)) ? Number(effortRaw) : 4, 0, 9);

    const out = await sharp(input, { failOn: "none" })
      .avif({
        quality,
        effort,
        chromaSubsampling: "4:2:0",
      })
      .toBuffer();

    return new NextResponse(out, {
      status: 200,
      headers: {
        "Content-Type": "image/avif",
        "Content-Disposition": 'attachment; filename="zippixel-edit.avif"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Export failed", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
