import { auth, clerkClient } from "@clerk/nextjs/server";
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
      return NextResponse.json({ step: "auth", error: "Unauthorized" }, { status: 401 });
    }

    // Step: get user
    const user = await clerkClient.users.getUser(userId);

    const md = (user.publicMetadata ?? {}) as Record<string, any>;

    const keyNow = monthKey();
    const keyStored = (md.usageMonthKey as string) ?? keyNow;

    let usage = Number(md.usageThisMonth ?? 0) || 0;

    if (keyStored !== keyNow) {
      usage = 0;
    }

    const nextUsage = usage + 1;

    // Step: update metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...md,
        usageThisMonth: nextUsage,
        usageMonthKey: keyNow,
      },
    });

    return NextResponse.json({
      success: true,
      userId,
      usageThisMonth: nextUsage,
      usageMonthKey: keyNow,
    });
  } catch (err: any) {
    // En önemli kısım: hatayı JSON olarak geri döndür
    return NextResponse.json(
      {
        step: "catch",
        name: err?.name,
        message: err?.message,
        status: err?.status,
        errors: err?.errors,
        stack: String(err?.stack ?? "").slice(0, 800),
      },
      { status: 500 }
    );
  }
}