// app/api/files/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getJob, readFileForJob } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const job = await getJob(userId, id);
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buf = await readFileForJob(userId, job.storedName);

  const outName = job.storedName; // istersen daha şık isim yaparız
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": job.mime,
      "Content-Disposition": `attachment; filename="${outName}"`,
      "Cache-Control": "no-store",
    },
  });
}