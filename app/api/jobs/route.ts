import { NextResponse } from "next/server";

declare global {
  var JOB_STORE: any[];
}

export async function GET() {
  const jobs = global.JOB_STORE || [];

  return NextResponse.json({
    jobs,
  });
}