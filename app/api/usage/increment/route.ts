import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PLANS, type PlanKey } from "@/lib/plans";

function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function safePlanKey(raw: any): PlanKey {
  return (["free", "basic", "pro", "plus"] as const).includes(raw) ? raw : "free";
}

export async function POST() {
  try {let userId: string | null = null;
    try {
      ({ userId } = await auth());
    } catch (e: any) {
      console.error("auth error:", e?.message || e);
      userId = null;
    }
if (!userId) {
      // Public compress flow: if user isn't signed in, don't fail the whole UX.
      return NextResponse.json({ success: false, reason: "UNAUTHENTICATED" }, { status: 200 });
    }

    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    const user = await clerk.users.getUser(userId);
    const md = (user.publicMetadata ?? {}) as Record<string, any>;

    const keyNow = monthKey();
    const keyStored = (md.usageMonthKey as string) ?? keyNow;

    const planKey = safePlanKey(md.plan);
    const limit = PLANS[planKey].monthlyLimitImages;

    let usage = Number(md.usageThisMonth ?? 0) || 0;

    // Yeni aya geçtiysek sıfırla
    if (keyStored !== keyNow) usage = 0;

    // Eski bug yüzünden limit üstüne çıktıysa normalize et
    if (limit > 0) usage = Math.min(usage, limit);

    // Limit doluysa increment yapma
    if (limit > 0 && usage >= limit) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", usageThisMonth: usage, limit, plan: planKey },
        { status: 403 }
      );
    }

    const nextUsage = limit > 0 ? Math.min(usage + 1, limit) : usage + 1;

    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...md,
        plan: planKey,
        usageThisMonth: nextUsage,
        usageMonthKey: keyNow,
      },
    });

    return NextResponse.json({
      success: true,
      usageThisMonth: nextUsage,
      limit,
      plan: planKey,
    });
  } catch (err: any) {
    console.error("usage/increment error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
