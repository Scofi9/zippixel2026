import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/is-admin";
import { getAdminUserList, safePlanLabel } from "@/lib/admin-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Admin — Subscriptions" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmtDate(ms?: number | null) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleDateString();
  } catch {
    return "—";
  }
}

export default async function AdminSubscriptionsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  const res = await getAdminUserList(200);
  if (!res.ok) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Subscription management.</p>
        </div>
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Server configuration needed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{res.error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const users = res.users;
  const planCounts = users.reduce(
    (acc, u) => {
      const md = (u.publicMetadata ?? {}) as Record<string, any>;
      const plan = safePlanLabel(md.plan);
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const paid = users
    .filter((u) => {
      const md = (u.publicMetadata ?? {}) as Record<string, any>;
      const plan = safePlanLabel(md.plan);
      return plan === "Basic" || plan === "Pro" || plan === "Plus";
    })
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  const total = users.length || 1;
  const summary = ["Free", "Basic", "Pro", "Plus"].map((p) => {
    const n = planCounts[p] || 0;
    const pct = Math.round((n / total) * 100);
    return { plan: p, users: n, percentage: `${pct}%` };
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real plan distribution from Clerk <span className="font-medium">publicMetadata.plan</span>.
          (Payments provider can be wired later.)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {summary.map((p) => (
          <Card key={p.plan} className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">{p.plan} Plan</div>
              <div className="mt-1 text-2xl font-bold text-foreground">{p.users.toLocaleString()}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.percentage} of users</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Paid Users</CardTitle>
          <CardDescription>Users on Basic / Pro / Plus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paid.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-sm text-muted-foreground">
                      No paid users yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  paid.map((u) => {
                    const email = u.emailAddresses?.[0]?.emailAddress || "—";
                    const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || email;
                    const md = (u.publicMetadata ?? {}) as Record<string, any>;
                    const plan = safePlanLabel(md.plan);
                    const status = u.banned ? "Banned" : "Active";
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="text-sm font-medium">{name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status === "Active" ? "secondary" : "outline"}>{status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {fmtDate(u.createdAt)}
                        </TableCell>
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
