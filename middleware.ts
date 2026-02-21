import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Admin must be signed in AND have role.
  if (isAdminRoute(req)) {
    // IMPORTANT: return the protect() response if it triggers a redirect.
    const protectRes = auth().protect();
    if (protectRes) return protectRes;

    const { sessionClaims } = auth();
    const md = (sessionClaims?.publicMetadata ?? {}) as Record<string, any>;
    const ok = md?.role === "admin" || md?.isAdmin === true || md?.plan === "admin";
    if (!ok) return NextResponse.redirect(new URL("/dashboard", req.url));

    return NextResponse.next();
  }

  // Dashboard routes must be signed in.
  if (isDashboardRoute(req)) {
    return auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
