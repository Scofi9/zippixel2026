import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/is-admin";
import { getRedis } from "@/lib/redis";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Admin — Settings" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  let maintenance = false;
  let registrations = true;

  try {
    const redis = getRedis();
    const [m, r] = await Promise.all([
      redis.get<number | string>("config:maintenance"),
      redis.get<number | string>("config:registrations"),
    ]);
    maintenance = String(m ?? "0") === "1";
    registrations = String(r ?? "1") !== "0";
  } catch {
    // ignore
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read-only view of runtime settings (stored in Redis).
        </p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Feature Flags</CardTitle>
          <CardDescription>Current platform flags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Maintenance Mode</div>
                <div className="text-xs text-muted-foreground">If enabled, show maintenance page to all users.</div>
              </div>
              <Badge variant={maintenance ? "default" : "secondary"}>{maintenance ? "ON" : "OFF"}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">New User Registration</div>
                <div className="text-xs text-muted-foreground">Allow new sign-ups.</div>
              </div>
              <Badge variant={registrations ? "secondary" : "outline"}>{registrations ? "ENABLED" : "DISABLED"}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Server</CardTitle>
          <CardDescription>Environment checks</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>Redis: {process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL ? "configured" : "missing"}</li>
            <li>Clerk secret: {process.env.CLERK_SECRET_KEY ? "configured" : "missing"}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
