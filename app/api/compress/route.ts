import { NextResponse } from "next/server";
import sharp from "sharp";

import { auth, createClerkClient } from "@clerk/nextjs/server";
import { PLANS, type PlanKey } from "@/lib/plans";

export const runtime = "nodejs";

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
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
    // 1) Auth zorunlu
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2) Kullanıcı + plan + usage çek
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const user = await clerk.users.getUser(userId);
    const md = (user.publicMetadata ?? {}) as Record<string, any>;

    const planKey = ((md.plan as string) ?? "free") as PlanKey;
    const plan = PLANS[planKey] ?? PLANS.free;

    const keyNow = monthKey();
    const keyStored = (md.usageMonthKey as string) ?? keyNow;

    // Ay değiştiyse kullanım sıfır kabul et
    const usageRaw = Number(md.usageThisMonth ?? 0) || 0;
    const usage = keyStored === keyNow ? usageRaw : 0;

    // 3) Limit dolduysa daha file bile işlemeye başlamadan blokla
    if (usage >= plan.monthlyLimitImages) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", limit: plan.monthlyLimitImages, usage },
        { status: 403 }
      );
    }

    // 4) Formdata + dosya kontrol
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // max file size (MB)
    const maxBytes = plan.maxFileMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "FILE_TOO_LARGE", maxFileMb: plan.maxFileMb },
        { status: 413 }
      );
    }

    // 5) Compress
    const qualityRaw = String(form.get("quality") ?? "80");
    const quality = Math.max(10, Math.min(100, Number(qualityRaw) || 80));

    const formatRaw = String(form.get("format") ?? "auto").toLowerCase();
    const out = pickOutput(formatRaw, file.type);

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const img = sharp(inputBuffer, { failOn: "none" });

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

    // 6) Burada istersen usage'ı server-side da artırabiliriz
    // ŞİMDİLİK artırmıyorum çünkü sen client-side increment çağırıyorsun,
    // ikisi birden olursa iki kez sayar.
    // (İstersen sonraki adımda increment'i tamamen buraya taşırız.)

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