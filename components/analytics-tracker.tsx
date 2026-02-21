"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

/**
 * Lightweight first-party analytics.
 * Sends a single pageview event on route change.
 *
 * This is intentionally simple and privacy-friendly:
 * - No cookies
 * - No user PII
 * - Uses a server-side hash for de-duping uniques
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const last = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;
    // Avoid double fires on hydration
    const key = `${pathname}::${isSignedIn ? "in" : "out"}`;
    if (last.current === key) return;
    last.current = key;

    const ctrl = new AbortController();
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      signal: ctrl.signal,
      keepalive: true,
    }).catch(() => {});

    return () => ctrl.abort();
  }, [pathname, isSignedIn]);

  return null;
}
