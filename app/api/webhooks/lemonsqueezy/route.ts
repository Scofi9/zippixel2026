import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanKey = "free" | "basic" | "pro" | "plus";

function safePlanKey(raw: any): PlanKey | null {
  const v = String(raw ?? "").toLowerCase();
  if (v === "free" || v === "basic" || v === "pro" || v === "plus") return v;
  return null;
}

function verifySignature(opts: { rawBody: string; signatureHex: string; secret: string }) {
  const signature = Buffer.from(opts.signatureHex ?? "", "hex");
  if (signature.length === 0 || opts.rawBody.length === 0) return false;

  const hmac = Buffer.from(
    crypto.createHmac("sha256", opts.secret).update(opts.rawBody).digest("hex"),
    "hex"
  );

  if (hmac.length !== signature.length) return false;
  return crypto.timingSafeEqual(hmac, signature);
}

/**
 * Lemon Squeezy webhook handler.
 *
 * When you create the webhook, set a signing secret and use the same value in:
 *   LEMONSQUEEZY_WEBHOOK_SECRET
 *
 * This route is SAFE to deploy before approval: if missing envs, it returns 200 OK,
 * so Lemon won’t keep retrying and you won’t get error spam.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signatureHex = request.headers.get("X-Signature") ?? "";

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim() ?? "";
  const enabled = (process.env.LEMONSQUEEZY_WEBHOOK_ENABLED ?? "false").toLowerCase() === "true";

  // If not enabled or secret not set, acknowledge safely.
  if (!enabled || !secret) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }

  if (!verifySignature({ rawBody, signatureHex, secret })) {
    return NextResponse.json({ ok: false, error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "BAD_JSON" }, { status: 400 });
  }

  const eventName =
    payload?.meta?.event_name ??
    payload?.meta?.event ??
    request.headers.get("X-Event-Name") ??
    "";

  const attributes = payload?.data?.attributes ?? {};
  const objectId = payload?.data?.id ?? null;

  // We strongly recommend adding custom data (user_id + plan) to checkout,
  // then reading it from payload.meta.custom_data as documented by Lemon Squeezy.
  const customData = payload?.meta?.custom_data ?? {};

  const userId = String(customData.user_id ?? customData.userId ?? "").trim();
  const planFromCustom = safePlanKey(customData.plan);

  // Fallback mapping (optional): map variant id to plan with env vars.
  const variantId = String(attributes?.variant_id ?? attributes?.variantId ?? "").trim();
  const map: Record<string, PlanKey> = {};
  const vb = process.env.LEMONSQUEEZY_VARIANT_BASIC?.trim();
  const vp = process.env.LEMONSQUEEZY_VARIANT_PRO?.trim();
  const vplus = process.env.LEMONSQUEEZY_VARIANT_PLUS?.trim();
  if (vb) map[vb] = "basic";
  if (vp) map[vp] = "pro";
  if (vplus) map[vplus] = "plus";

  const plan = planFromCustom ?? (variantId && map[variantId]) ?? null;

  // Subscription identifiers (useful for later billing portal sync)
  const customerId = String(attributes?.customer_id ?? "").trim();
  const subscriptionId = String(objectId ?? attributes?.id ?? "").trim();
  const status = String(attributes?.status ?? "").trim();

  // Decide plan action based on event
  // Recommended minimum events are subscription_* events per Lemon docs.
  if (!userId || !process.env.CLERK_SECRET_KEY) {
    // Acknowledge but record nothing if we can’t associate a user.
    return NextResponse.json({ ok: true, received: true, eventName }, { status: 200 });
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

  if (String(eventName).startsWith("subscription_")) {
    if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      // Downgrade on cancel/expire (conservative)
      await clerk.users.updateUser(userId, {
        publicMetadata: {
          plan: "free",
          lemonsqueezyCustomerId: customerId || undefined,
          lemonsqueezySubscriptionId: subscriptionId || undefined,
          lemonsqueezyStatus: status || undefined,
          lemonsqueezyUpdatedAt: Date.now(),
        },
      });
    } else {
      // created / updated / resumed / payment_success etc.
      if (plan) {
        await clerk.users.updateUser(userId, {
          publicMetadata: {
            plan,
            lemonsqueezyCustomerId: customerId || undefined,
            lemonsqueezySubscriptionId: subscriptionId || undefined,
            lemonsqueezyStatus: status || undefined,
            lemonsqueezyUpdatedAt: Date.now(),
          },
        });
      }
    }
  }

  return NextResponse.json({ ok: true, eventName }, { status: 200 });
}
