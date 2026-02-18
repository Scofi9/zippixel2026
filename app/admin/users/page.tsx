import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Admin — Users" }

const users = [
  { name: "Sarah Chen", email: "sarah@raycast.com", plan: "Enterprise", status: "Active", created: "Jan 15, 2026", lastActive: "2 min ago", initials: "SC" },
  { name: "Marcus Johnson", email: "marcus@verifiable.io", plan: "Pro", status: "Active", created: "Dec 3, 2025", lastActive: "1 hour ago", initials: "MJ" },
  { name: "Emily Rodriguez", email: "emily@prisma.io", plan: "Pro", status: "Active", created: "Nov 20, 2025", lastActive: "3 hours ago", initials: "ER" },
  { name: "David Kim", email: "david@acme.com", plan: "Free", status: "Active", created: "Feb 1, 2026", lastActive: "1 day ago", initials: "DK" },
  { name: "Lisa Wang", email: "lisa@startup.co", plan: "Pro", status: "Inactive", created: "Oct 10, 2025", lastActive: "2 weeks ago", initials: "LW" },
  { name: "James Miller", email: "james@agency.io", plan: "Enterprise", status: "Active", created: "Sep 5, 2025", lastActive: "5 min ago", initials: "JM" },
  { name: "Anna Novak", email: "anna@design.studio", plan: "Free", status: "Active", created: "Feb 10, 2026", lastActive: "30 min ago", initials: "AN" },
  { name: "Robert Taylor", email: "robert@bigcorp.com", plan: "Enterprise", status: "Active", created: "Aug 22, 2025", lastActive: "12 min ago", initials: "RT" },
]

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage all registered users.</p>
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
                  <TableHead className="hidden sm:table-cell">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={user.plan === "Enterprise" ? "bg-primary/10 text-primary" : ""}>{user.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "secondary" : "outline"} className={user.status === "Active" ? "bg-primary/10 text-primary" : ""}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{user.created}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{user.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
