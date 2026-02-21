import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = auth();

    if (!userId) {
      return auth().redirectToSignIn();
    }

    // Admin gate (only on /admin)
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const md = (sessionClaims?.publicMetadata ?? {}) as Record<string, any>;
      const ok =
        md?.role === "admin" || md?.isAdmin === true || md?.plan === "admin";

      if (!ok) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  // Clerk recommends running middleware on app + api routes (except static assets)
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
