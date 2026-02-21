import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function maskKey(k?: string | null) {
  if (!k) return "";
  if (k.length <= 10) return `${k.slice(0, 4)}…`;
  return `${k.slice(0, 7)}…${k.slice(-4)}`;
}

export async function GET() {let userId: string | null = null;
  try {
    ({ userId } = await auth());
  } catch (e: any) {
    console.error("auth error:", e?.message || e);
    userId = null;
  }
if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await clerkClient.users.getUser(userId);
  const prefs = (user.publicMetadata?.preferences ?? {}) as Record<string, any>;
  const apiKey = (user.privateMetadata?.apiKey as string | undefined) ?? "";

  return NextResponse.json({
    fullName: user.fullName ?? "",
    email: user.primaryEmailAddress?.emailAddress ?? "",
    prefs: {
      emailNotifications: Boolean(prefs.emailNotifications ?? true),
      autoDeleteOriginals: Boolean(prefs.autoDeleteOriginals ?? false),
      webhookNotifications: Boolean(prefs.webhookNotifications ?? false),
    },
    apiKeyMasked: apiKey ? maskKey(apiKey) : "",
    hasApiKey: Boolean(apiKey),
  });
}
