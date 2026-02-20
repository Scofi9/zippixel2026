import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use /api/download instead." },
    { status: 410 }
  );
}