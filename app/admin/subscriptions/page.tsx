import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Admin — Subscriptions" }

const planSummary = [
  { plan: "Free", users: 4215, percentage: "33%" },
  { plan: "Pro", users: 7180, percentage: "56%" },
  { plan: "Enterprise", users: 1452, percentage: "11%" },
]

const subscriptions = [
  { user: "sarah@raycast.com", plan: "Enterprise", status: "Active", amount: "$499/mo", started: "Jan 15, 2026", renewal: "Feb 15, 2026" },
  { user: "marcus@verifiable.io", plan: "Pro", status: "Active", amount: "$12/mo", started: "Dec 3, 2025", renewal: "Mar 3, 2026" },
  { user: "emily@prisma.io", plan: "Pro", status: "Active", amount: "$12/mo", started: "Nov 20, 2025", renewal: "Feb 20, 2026" },
  { user: "james@agency.io", plan: "Enterprise", status: "Active", amount: "$499/mo", started: "Sep 5, 2025", renewal: "Mar 5, 2026" },
  { user: "lisa@startup.co", plan: "Pro", status: "Cancelled", amount: "$12/mo", started: "Oct 10, 2025", renewal: "N/A" },
  { user: "robert@bigcorp.com", plan: "Enterprise", status: "Active", amount: "$499/mo", started: "Aug 22, 2025", renewal: "Feb 22, 2026" },
]

export default function AdminSubscriptionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="mt-1 text-sm text-muted-foreground">Subscription management and plan distribution.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {planSummary.map((p) => (
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
          <CardTitle className="text-base">Subscription List</CardTitle>
          <CardDescription>All paid subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Started</TableHead>
                  <TableHead className="hidden md:table-cell">Renewal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.user}>
                    <TableCell className="text-sm font-medium">{sub.user}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={sub.plan === "Enterprise" ? "bg-primary/10 text-primary" : ""}>{sub.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={sub.status === "Active" ? "secondary" : "outline"} className={sub.status === "Active" ? "bg-primary/10 text-primary" : ""}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{sub.amount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{sub.started}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{sub.renewal}</TableCell>
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
