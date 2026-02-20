import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const fullName = String(body.fullName ?? "").trim();
  if (!fullName) return NextResponse.json({ error: "Full name required" }, { status: 400 });

  const parts = fullName.split(/\s+/);
  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");

  await clerkClient.users.updateUser(userId, { firstName, lastName });
  return NextResponse.json({ ok: true });
}
