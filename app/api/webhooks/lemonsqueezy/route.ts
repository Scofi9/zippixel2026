import { NextResponse } from "next/server"

/**
 * Lemon Squeezy webhook endpoint (READY, but safe-by-default).
 *
 * When Lemon Squeezy approval arrives:
 * 1) Set LEMON_SQUEEZY_WEBHOOK_SECRET in env
 * 2) Turn on processing by setting LEMON_SQUEEZY_WEBHOOK_ENABLED=true
 * 3) In handler below, map subscription events -> Clerk publicMetadata plan updates.
 */

export async function POST(req: Request) {
  // Safe default: accept but do nothing unless explicitly enabled.
  const enabled = process.env.LEMON_SQUEEZY_WEBHOOK_ENABLED === "true"

  // Always read body (so signature verification can be added later without changing contract)
  const bodyText = await req.text().catch(() => "")

  if (!enabled) {
    // Respond 200 so Lemon doesn't keep retrying while you're still waiting/setting up.
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 })
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Missing LEMON_SQUEEZY_WEBHOOK_SECRET" },
      { status: 500 }
    )
  }

  // TODO (after approval):
  // - Verify signature header with secret.
  // - Parse JSON.
  // - Map subscription events -> Clerk user metadata.
  // - Store subscription IDs for portal linking.

  // Placeholder so the route is production-safe today.
  return NextResponse.json({ ok: true, received: bodyText.length }, { status: 200 })
}
