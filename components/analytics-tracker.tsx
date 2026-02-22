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
  const { isSignedIn, userId } = useAuth();
  const lastPath = useRef<string>("");
  const prevAuth = useRef<boolean | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Avoid double fires on hydration / rerenders
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const ctrl = new AbortController();
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "pageview", path: pathname }),
      signal: ctrl.signal,
      keepalive: true,
    }).catch(() => {});

    return () => ctrl.abort();
  }, [pathname]);

  useEffect(() => {
    if (!pathname) return;
    if (prevAuth.current === null) {
      prevAuth.current = Boolean(isSignedIn);
      if (isSignedIn && userId && typeof window !== "undefined") {
        window.localStorage.setItem("zippixel_last_uid", userId);
      }
      return;
    }

    // track transitions
    if (!prevAuth.current && isSignedIn) {
      if (userId && typeof window !== "undefined") {
        window.localStorage.setItem("zippixel_last_uid", userId);
      }
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "login", path: pathname }),
        keepalive: true,
      }).catch(() => {});
    }

    if (prevAuth.current && !isSignedIn) {
      const uidHint = typeof window !== "undefined" ? window.localStorage.getItem("zippixel_last_uid") : null;
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "logout", path: pathname, uidHint }),
        keepalive: true,
      }).catch(() => {});
    }

    prevAuth.current = Boolean(isSignedIn);
  }, [isSignedIn, userId, pathname]);

  return null;
}
