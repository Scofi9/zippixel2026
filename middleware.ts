import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Only run on protected routes
  if (!isProtectedRoute(req)) return;

  // IMPORTANT: return the result so Clerk can redirect instead of throwing
  const protectRes = auth().protect();
  if (protectRes) return protectRes;

  // Admin gate
  if (isAdminRoute(req)) {
    const { sessionClaims } = auth();
    const md = (sessionClaims?.publicMetadata ?? {}) as Record<string, any>;
    const ok = md?.role === "admin" || md?.isAdmin === true || md?.plan === "admin";
    if (!ok) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
