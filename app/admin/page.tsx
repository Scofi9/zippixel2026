import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRedis } from "@/lib/redis";
import { isAdminUser } from "@/lib/is-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Admin" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
  const b = Number(bytes || 0);
  if (!b) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), sizes.length - 1);
  return (b / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

export default async function AdminPage() {
  let user = null as any;
  try {
    user = await currentUser();
  } catch (e: any) {
    console.error('currentUser error:', e?.message || e);
    user = null;
  }
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  let compressions = 0;
  let savedBytes = 0;

  try {
    const redis = getRedis();
    const [c, s] = await Promise.all([
      redis.get<number>("global:compressions"),
      redis.get<number>("global:savedBytes"),
    ]);
    compressions = Number(c || 0);
    savedBytes = Number(s || 0);
  } catch {
    // ignore
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Private dashboard. Visible only to users with <span className="font-medium">role=admin</span>.
          </p>
        </div>
        <Badge variant="secondary">Admin mode</Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Total compressions</CardTitle>
            <CardDescription>Lifetime total (all users)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{compressions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Total bytes saved</CardTitle>
            <CardDescription>Estimated, based on original vs output sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{formatBytes(savedBytes)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Next up</CardTitle>
            <CardDescription>
              You can extend this panel with user lists, billing events, abuse reports, and usage analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            For now, this confirms admin gating is working and shows live metrics from Redis.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
