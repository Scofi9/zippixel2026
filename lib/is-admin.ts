import type { User } from "@clerk/nextjs/server";

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const md = (user.publicMetadata ?? {}) as Record<string, any>;
  return md.role === "admin" || md.isAdmin === true || md.plan === "admin";
}
