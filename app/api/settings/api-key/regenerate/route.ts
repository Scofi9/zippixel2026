import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function newKey() {
  return `zpx_sk_${crypto.randomUUID().replace(/-/g, "")}`;
}

function maskKey(k: string) {
  return `${k.slice(0, 7)}…${k.slice(-4)}`;
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await clerkClient.users.getUser(userId);
  const apiKey = newKey();
  const privateMetadata = { ...(user.privateMetadata ?? {}), apiKey };
  await clerkClient.users.updateUser(userId, { privateMetadata });

  return NextResponse.json({ apiKeyMasked: maskKey(apiKey) });
}
