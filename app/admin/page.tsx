import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRedis } from "@/lib/redis";
import { isAdminUser } from "@/lib/is-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  let compressions = 0;
  let savedBytes = 0;
  let pvToday = 0;
  let uvToday = 0;
  let loginToday = 0;
  let pv7 = 0;
  let uv7 = 0;
  let login7 = 0;
  let pvTotal = 0;
  let loginTotal = 0;
  let recentEvents: Array<{ t: number; path: string; in: boolean }> = [];

  try {
    const redis = getRedis();

    const dayKey = (d: Date) => {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    const today = new Date();
    const keys7: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - i);
      const k = dayKey(d);
      keys7.push(k);
    }

    const dk = keys7[0];

    const [c, s, pvT, logT, pvTd, logTd, uvTd, events] = await Promise.all([
      redis.get<number>("global:compressions"),
      redis.get<number>("global:savedBytes"),
      redis.get<number>("analytics:pv:total"),
      redis.get<number>("analytics:login:total"),
      redis.get<number>(`analytics:pv:${dk}`),
      redis.get<number>(`analytics:login:${dk}`),
      redis.scard(`analytics:uv:${dk}`),
      redis.lrange<string>("analytics:events", 0, 24),
    ]);

    compressions = Number(c || 0);
    savedBytes = Number(s || 0);
    pvTotal = Number(pvT || 0);
    loginTotal = Number(logT || 0);
    pvToday = Number(pvTd || 0);
    loginToday = Number(logTd || 0);
    uvToday = Number(uvTd || 0);

    // 7-day sums
    const pvPromises = keys7.map((k) => redis.get<number>(`analytics:pv:${k}`));
    const loginPromises = keys7.map((k) => redis.get<number>(`analytics:login:${k}`));
    const uvPromises = keys7.map((k) => redis.scard(`analytics:uv:${k}`));

    const [pvArr, loginArr, uvArr] = await Promise.all([
      Promise.all(pvPromises),
      Promise.all(loginPromises),
      Promise.all(uvPromises),
    ]);

    pv7 = pvArr.reduce((a, b) => a + Number(b || 0), 0);
    login7 = loginArr.reduce((a, b) => a + Number(b || 0), 0);
    uv7 = uvArr.reduce((a, b) => a + Number(b || 0), 0);

    recentEvents = (events || [])
      .map((x) => {
        try {
          return JSON.parse(x) as { t: number; path: string; in: boolean };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as any;
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
            <CardTitle>Traffic</CardTitle>
            <CardDescription>First-party analytics (no cookies). Pageviews, uniques, and logins.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                <div className="text-sm text-muted-foreground">Today</div>
                <div className="mt-2 text-2xl font-semibold">{pvToday.toLocaleString()} PV</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {uvToday.toLocaleString()} uniques · {loginToday.toLocaleString()} logins
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                <div className="text-sm text-muted-foreground">Last 7 days</div>
                <div className="mt-2 text-2xl font-semibold">{pv7.toLocaleString()} PV</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {uv7.toLocaleString()} uniques · {login7.toLocaleString()} logins
                </div>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/30 p-4">
                <div className="text-sm text-muted-foreground">All time</div>
                <div className="mt-2 text-2xl font-semibold">{pvTotal.toLocaleString()} PV</div>
                <div className="mt-1 text-sm text-muted-foreground">{loginTotal.toLocaleString()} logins</div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="text-sm font-medium">Recent activity</div>
            <div className="mt-3 space-y-2">
              {recentEvents.length === 0 ? (
                <div className="text-sm text-muted-foreground">No events yet. Open the site in a new tab to generate traffic.</div>
              ) : (
                recentEvents.map((e, idx) => (
                  <div
                    key={`${e.t}-${idx}`}
                    className="flex items-center justify-between rounded-md border border-border/50 bg-background/30 px-3 py-2"
                  >
                    <div className="text-sm">
                      <span className="font-medium">{e.path}</span>
                      <span className="ml-2 text-muted-foreground">
                        {new Date(e.t).toLocaleString()}
                      </span>
                    </div>
                    <Badge variant={e.in ? "default" : "secondary"}>{e.in ? "signed-in" : "guest"}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Next up</CardTitle>
            <CardDescription>
              You can extend this panel with user lists, billing events, abuse reports, and conversion funnels.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This panel is fully live: it updates from Redis in real time. No third-party trackers.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
