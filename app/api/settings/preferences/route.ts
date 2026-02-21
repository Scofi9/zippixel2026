import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const preferences = {
    emailNotifications: Boolean(body.emailNotifications),
    autoDeleteOriginals: Boolean(body.autoDeleteOriginals),
    webhookNotifications: Boolean(body.webhookNotifications),
  };

  const user = await clerkClient.users.getUser(userId);
  const publicMetadata = { ...(user.publicMetadata ?? {}), preferences };
  await clerkClient.users.updateUser(userId, { publicMetadata });

  return NextResponse.json({ ok: true });
}
