import { createClerkClient } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";

export type AdminEvent =
  | {
      t: number;
      type: "pageview";
      path: string;
      in: boolean;
      userId?: string | null;
    }
  | {
      t: number;
      type: "login";
      path: string;
      userId: string;
    }
  | {
      t: number;
      type: "logout";
      path: string;
      userId?: string | null;
    }
  | {
      t: number;
      type: "compress";
      userId: string | null;
      file: string;
      fmt: string;
      originalBytes: number;
      compressedBytes: number;
      savedBytes: number;
      savingsPercent: number;
    };

export type CropEvent = {
  t: number;
  type: "crop";
  userId: string | null;
  file: string;
  fmt: string;
  originalBytes: number;
  outputBytes: number;
  crop: { x: number; y: number; width: number; height: number; rotation: number };
};

export type DownloadEvent = {
  t: number;
  type: "download";
  userId: string;
  action: "compress" | "crop";
  file: string;
  fmt: string;
  id?: string;
};

// Backward-compatible union (admin:events may contain older records)
export type AnyAdminEvent = AdminEvent | CropEvent | DownloadEvent;

export function formatBytes(bytes: number) {
  const b = Number(bytes || 0);
  if (!b) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), sizes.length - 1);
  return (b / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

export async function getRecentAdminEvents(limit = 50) {
  const redis = getRedis();

  const raw = await redis.lrange<string>("admin:events", 0, Math.max(0, limit - 1));
  const events: AnyAdminEvent[] = (raw || [])
    .map((x) => {
      try {
        return JSON.parse(x) as AnyAdminEvent;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as any;

  // Enrich with email/name for a handful of users
  const userIds = Array.from(
    new Set(
      events
        .map((e) => ("userId" in e ? (e as any).userId : null))
        .filter(Boolean) as string[]
    )
  ).slice(0, 25);

  const map = new Map<string, { email?: string; name?: string }>();

  if (userIds.length && process.env.CLERK_SECRET_KEY) {
    try {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const users = await Promise.allSettled(userIds.map((id) => clerk.users.getUser(id)));
      for (const u of users) {
        if (u.status === "fulfilled") {
          const email = u.value.emailAddresses?.[0]?.emailAddress;
          const name = [u.value.firstName, u.value.lastName].filter(Boolean).join(" ") || u.value.username || undefined;
          map.set(u.value.id, { email, name });
        }
      }
    } catch {
      // ignore
    }
  }

  return { events, userMap: map };
}

export async function getAdminUserList(limit = 100) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { ok: false as const, error: "Missing CLERK_SECRET_KEY on the server." };
  }

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  const res = await clerk.users.getUserList({ limit: Math.min(limit, 200) });
  return { ok: true as const, users: res.data };
}

export function safePlanLabel(raw: any) {
  const v = String(raw ?? "free").toLowerCase();
  if (v === "plus") return "Plus";
  if (v === "pro") return "Pro";
  if (v === "basic") return "Basic";
  if (v === "admin") return "Admin";
  return "Free";
}
