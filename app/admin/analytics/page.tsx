import type { Metadata } from "next"
import { TrendingUp, Users, ImageDown, Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminAnalyticsCharts } from "@/components/admin/analytics-charts"

export const metadata: Metadata = { title: "Admin — Analytics" }

const metrics = [
  { label: "Daily Active Users", value: "3,247", change: "+8.4%", icon: Users },
  { label: "Images Today", value: "42,180", change: "+22.1%", icon: ImageDown },
  { label: "Conversion Rate", value: "4.2%", change: "+0.3%", icon: TrendingUp },
  { label: "Global Regions", value: "32", change: "+2", icon: Globe },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform analytics and growth metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <metric.icon className="size-5 text-muted-foreground" />
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">{metric.change}</Badge>
              </div>
              <div className="mt-3 text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{metric.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminAnalyticsCharts />
    </div>
  )
}
