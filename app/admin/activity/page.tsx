import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "Admin — Activity Logs" }

const activities = [
  { event: "Image compressed", user: "sarah@raycast.com", details: "hero-banner.jpg (3.2 MB -> 680 KB)", type: "compress", time: "2 min ago" },
  { event: "User signed up", user: "new-user@gmail.com", details: "Free plan", type: "auth", time: "8 min ago" },
  { event: "Plan upgraded", user: "marcus@verifiable.io", details: "Free -> Pro", type: "billing", time: "15 min ago" },
  { event: "API key generated", user: "emily@prisma.io", details: "New API key created", type: "api", time: "32 min ago" },
  { event: "Batch compression", user: "james@agency.io", details: "24 images processed", type: "compress", time: "1 hour ago" },
  { event: "User signed up", user: "designer@studio.co", details: "Pro plan trial", type: "auth", time: "1.5 hours ago" },
  { event: "Webhook configured", user: "robert@bigcorp.com", details: "POST endpoint added", type: "api", time: "2 hours ago" },
  { event: "Subscription cancelled", user: "lisa@startup.co", details: "Pro plan", type: "billing", time: "3 hours ago" },
  { event: "Image compressed", user: "anna@design.studio", details: "logo.png (1.8 MB -> 240 KB)", type: "compress", time: "4 hours ago" },
  { event: "Password changed", user: "david@acme.com", details: "Security update", type: "auth", time: "5 hours ago" },
]

const typeColors: Record<string, string> = {
  compress: "bg-primary/10 text-primary",
  auth: "bg-chart-2/10 text-chart-2",
  billing: "bg-chart-4/10 text-chart-4",
  api: "bg-chart-3/10 text-chart-3",
}

export default function AdminActivityPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">System-wide activity and event logs.</p>
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
                {activities.map((activity, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{activity.event}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={typeColors[activity.type] || ""}>
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{activity.user}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{activity.details}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{activity.time}</TableCell>
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
