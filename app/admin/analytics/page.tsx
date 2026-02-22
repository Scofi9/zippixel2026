import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TrendingUp, Users, ImageDown, Globe } from "lucide-react";
import { isAdminUser } from "@/lib/is-admin";
import { getRedis } from "@/lib/redis";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminAnalyticsCharts, type DailyPoint, type FormatPoint } from "@/components/admin/analytics-charts";

export const metadata: Metadata = { title: "Admin — Analytics" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dayKey(d = new Date()) {
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function shortDow(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default async function AdminAnalyticsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  const redis = getRedis();

  // Build last 7 days (UTC)
  const today = new Date();
  const days: { dk: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() - i);
    days.push({ dk: dayKey(d), label: shortDow(d) });
  }

  const pvPromises = days.map((x) => redis.get<number>(`analytics:pv:${x.dk}`));
  const uvPromises = days.map((x) => redis.scard(`analytics:uv:${x.dk}`));
  const loginPromises = days.map((x) => redis.get<number>(`analytics:login:${x.dk}`));
  const compPromises = days.map((x) => redis.get<number>(`daily:compressions:${x.dk}`));
  const cropPromises = days.map((x) => redis.get<number>(`daily:crops:${x.dk}`));
  const dlPromises = days.map((x) => redis.get<number>(`daily:downloads:${x.dk}`));

  const [pvArr, uvArr, loginArr, compArr, cropArr, dlArr, totalPv, totalLogin, totalComp, totalCrops, totalDownloads, fmtWebp, fmtAvif, fmtJpeg, fmtPng, fmtOrig] = await Promise.all([
    Promise.all(pvPromises),
    Promise.all(uvPromises),
    Promise.all(loginPromises),
    Promise.all(compPromises),
    Promise.all(cropPromises),
    Promise.all(dlPromises),
    redis.get<number>("analytics:pv:total"),
    redis.get<number>("analytics:login:total"),
    redis.get<number>("global:compressions"),
    redis.get<number>("global:crops"),
    redis.get<number>("global:downloads"),
    redis.get<number>("global:format:WEBP"),
    redis.get<number>("global:format:AVIF"),
    redis.get<number>("global:format:JPEG"),
    redis.get<number>("global:format:PNG"),
    redis.get<number>("global:format:ORIGINAL"),
  ]);

  const dailyData: DailyPoint[] = days.map((d, idx) => {
    const dau = Number(uvArr[idx] || 0);
    const pageviews = Number(pvArr[idx] || 0);
    const logins = Number(loginArr[idx] || 0);
    const compressions = Number(compArr[idx] || 0);
    const crops = Number(cropArr[idx] || 0);
    const downloads = Number(dlArr[idx] || 0);
    const ops = compressions + crops;
    return { day: d.label, dau, pageviews, logins, compressions, crops, downloads, ops };
  });

  const totalFmt =
    Number(fmtWebp || 0) +
    Number(fmtAvif || 0) +
    Number(fmtJpeg || 0) +
    Number(fmtPng || 0) +
    Number(fmtOrig || 0);

  const pct = (n: number) => (totalFmt > 0 ? Math.round((n / totalFmt) * 100) : 0);

  const formatData: FormatPoint[] = [
    { name: "WebP", value: pct(Number(fmtWebp || 0)), color: "oklch(0.75 0.18 155)" },
    { name: "AVIF", value: pct(Number(fmtAvif || 0)), color: "oklch(0.828 0.189 84.429)" },
    { name: "JPG", value: pct(Number(fmtJpeg || 0)), color: "oklch(0.6 0.118 184.704)" },
    { name: "PNG", value: pct(Number(fmtPng || 0)), color: "oklch(0.55 0.07 260)" },
  ].filter((x) => x.value > 0);

  const pv7 = pvArr.reduce((a, b) => a + Number(b || 0), 0);
  const uv7 = uvArr.reduce((a, b) => a + Number(b || 0), 0);
  const login7 = loginArr.reduce((a, b) => a + Number(b || 0), 0);
  const comp7 = compArr.reduce((a, b) => a + Number(b || 0), 0);
  const crop7 = cropArr.reduce((a, b) => a + Number(b || 0), 0);
  const dl7 = dlArr.reduce((a, b) => a + Number(b || 0), 0);

  const metrics = [
    { label: "Uniques (7d)", value: uv7.toLocaleString(), change: "live", icon: Users },
    { label: "Pageviews (7d)", value: pv7.toLocaleString(), change: "live", icon: Globe },
    { label: "Logins (7d)", value: login7.toLocaleString(), change: "live", icon: TrendingUp },
    { label: "Compressions (7d)", value: comp7.toLocaleString(), change: "live", icon: ImageDown },
    { label: "Crops (7d)", value: crop7.toLocaleString(), change: "live", icon: ImageDown },
    { label: "Downloads (7d)", value: dl7.toLocaleString(), change: "live", icon: ImageDown },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real metrics from Upstash Redis.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <metric.icon className="size-5 text-muted-foreground" />
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-3 text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminAnalyticsCharts dailyData={dailyData} formatData={formatData.length ? formatData : [{ name: "—", value: 0, color: "oklch(0.65 0 0)" }]} />

      <Card className="border-border/50 bg-card/50">
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-medium text-foreground">{Number(totalComp || 0).toLocaleString()}</span> compressions ·{" "}
            <span className="font-medium text-foreground">{Number(totalCrops || 0).toLocaleString()}</span> crops ·{" "}
            <span className="font-medium text-foreground">{Number(totalDownloads || 0).toLocaleString()}</span> downloads ·{" "}
            <span className="font-medium text-foreground">{Number(totalLogin || 0).toLocaleString()}</span> logins
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
