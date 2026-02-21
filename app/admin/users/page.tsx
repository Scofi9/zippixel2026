import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/is-admin";
import { getAdminUserList, safePlanLabel } from "@/lib/admin-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = { title: "Admin — Users" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function initials(name?: string | null, email?: string | null) {
  const n = (name || "").trim();
  if (n) {
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || parts[0]?.[1] || "";
    return (a + b).toUpperCase();
  }
  const e = (email || "U").trim();
  return e.slice(0, 2).toUpperCase();
}

function fmtDate(ms?: number | null) {
  if (!ms) return "—";
  try {
    return new Date(ms).toLocaleDateString();
  } catch {
    return "—";
  }
}

export default async function AdminUsersPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  if (!isAdminUser(user)) redirect("/dashboard");

  const res = await getAdminUserList(100);

  if (!res.ok) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage all registered users.</p>
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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Real users from Clerk.</p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Created</TableHead>
                  <TableHead className="hidden sm:table-cell">Last Sign-in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const email = u.emailAddresses?.[0]?.emailAddress || "";
                  const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || "";
                  const md = (u.publicMetadata ?? {}) as Record<string, any>;
                  const plan = safePlanLabel(md.plan);
                  const status = u.banned ? "Banned" : "Active";
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-primary/10 text-xs text-primary">
                              {initials(name, email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-foreground">{name || email || u.id}</div>
                            <div className="text-xs text-muted-foreground">{email || "—"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={plan === "Plus" || plan === "Pro" ? "bg-primary/10 text-primary" : ""}
                        >
                          {plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status === "Active" ? "secondary" : "outline"}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                        {fmtDate(u.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                        {fmtDate(u.lastSignInAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
