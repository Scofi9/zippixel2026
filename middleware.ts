import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // Protect dashboard + admin
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = auth();

    if (!userId) {
      // Redirect to sign-in (Edge safe)
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
  // IMPORTANT: don't run middleware on static files (_next, images, etc) or API routes.
  matcher: ["/((?!_next|.*\..*|api).*)"],
};
