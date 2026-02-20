import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listJobs } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await listJobs(userId);

  const shaped = jobs.map((j) => ({
    id: j.id,
    fileName: j.originalName,
    format: j.outputFormat.toUpperCase(),
    originalBytes: j.inputBytes,
    compressedBytes: j.outputBytes,
    savingsPercent: j.savingsPercent,
    createdAt: j.createdAt,
    downloadUrl: `/api/files/${j.id}`,
  }));

  return NextResponse.json({ jobs: shaped });
}