import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const user = await clerk.users.getUser(userId);
    const md = (user.publicMetadata ?? {}) as Record<string, any>;

    const keyNow = monthKey();
    const keyStored = (md.usageMonthKey as string) ?? keyNow;

    let usage = Number(md.usageThisMonth ?? 0) || 0;
    if (keyStored !== keyNow) usage = 0;

    const nextUsage = usage + 1;

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...md,
        usageThisMonth: nextUsage,
        usageMonthKey: keyNow,
      },
    });

    return NextResponse.json({ success: true, usageThisMonth: nextUsage });
  } catch (err: any) {
    console.error("usage/increment error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}