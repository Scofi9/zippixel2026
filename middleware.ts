import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Protect dashboard + admin
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  // Admin gate (only if signed in)
  if (isAdminRoute(req)) {
    const { sessionClaims } = auth();
    const md = (sessionClaims?.publicMetadata ?? {}) as Record<string, any>;
    const ok = md?.role === "admin" || md?.isAdmin === true || md?.plan === "admin";
    if (!ok) return NextResponse.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
