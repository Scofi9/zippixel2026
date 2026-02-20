import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (!isProtectedRoute(req)) return;

  auth().protect();

  if (isAdminRoute(req)) {
    const claims = auth().sessionClaims as any;
    const md = (claims?.publicMetadata ?? claims?.metadata ?? {}) as Record<string, any>;
    const ok = md?.role === "admin" || md?.isAdmin === true || md?.plan === "admin";
    if (!ok) {
      const url = new URL("/dashboard", req.url);
      return Response.redirect(url);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
