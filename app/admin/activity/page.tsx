import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/is-admin";
import { getRecentAdminEvents, formatBytes } from "@/lib/admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Admin — Activity Logs" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timeAgo(ts: number) {
  const sec = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

export default async function AdminActivityPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  const { events, userMap } = await getRecentAdminEvents(80);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real events captured from compressions and first-party tracking.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">User</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-sm text-muted-foreground">
                      No events yet. Compress an image or open the site to generate activity.
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((e, i) => {
                    const uid = "userId" in e ? e.userId : null;
                    const u = uid ? userMap.get(uid) : null;
                    const userLabel = uid ? (u?.email || u?.name || uid.slice(0, 10) + "…") : "guest";

                    if (e.type === "compress") {
                      return (
                        <TableRow key={`${e.t}-${i}`}>
                          <TableCell className="text-sm font-medium">Image compressed</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              compress
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {userLabel}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            {e.file} ({formatBytes(e.originalBytes)} → {formatBytes(e.compressedBytes)}) · {e.fmt}
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {timeAgo(e.t)}
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (e.type === "crop") {
                      return (
                        <TableRow key={`${e.t}-${i}`}>
                          <TableCell className="text-sm font-medium">Image cropped</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              crop
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {userLabel}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            {(e as any).file} ({formatBytes((e as any).originalBytes)} → {formatBytes((e as any).outputBytes)}) · {(e as any).fmt}
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{timeAgo(e.t)}</TableCell>
                        </TableRow>
                      );
                    }

                    if (e.type === "download") {
                      return (
                        <TableRow key={`${e.t}-${i}`}>
                          <TableCell className="text-sm font-medium">Download</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              download
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {userLabel}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                            {(e as any).action} · {(e as any).file} · {(e as any).fmt}
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{timeAgo(e.t)}</TableCell>
                        </TableRow>
                      );
                    }

                    if (e.type === "login") {
                      return (
                        <TableRow key={`${e.t}-${i}`}>
                          <TableCell className="text-sm font-medium">User login</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                              login
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {userLabel}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{(e as any).path}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{timeAgo(e.t)}</TableCell>
                        </TableRow>
                      );
                    }

                    if (e.type === "logout") {
                      return (
                        <TableRow key={`${e.t}-${i}`}>
                          <TableCell className="text-sm font-medium">User logout</TableCell>
                          <TableCell>
                            <Badge variant="secondary">logout</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                            {userLabel}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{(e as any).path}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">{timeAgo(e.t)}</TableCell>
                        </TableRow>
                      );
                    }

                    // pageview
                    return (
                      <TableRow key={`${e.t}-${i}`}>
                        <TableCell className="text-sm font-medium">Page view</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={e.in ? "bg-primary/10 text-primary" : ""}>
                            {e.in ? "signed-in" : "guest"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {userLabel}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{e.path}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{timeAgo(e.t)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
