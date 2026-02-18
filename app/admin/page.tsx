import type { Metadata } from "next"
import { Users, UserCheck, ImageDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminChart } from "@/components/admin/admin-chart"

export const metadata: Metadata = {
  title: "Admin Overview",
  description: "ZipPixel admin dashboard overview.",
}

const stats = [
  { label: "Total Users", value: "12,847", change: "+18.2%", icon: Users },
  { label: "Active Users", value: "8,432", change: "+12.1%", icon: UserCheck },
  { label: "Total Compressions", value: "2.4M", change: "+24.5%", icon: ImageDown },
  { label: "Monthly Revenue", value: "$48,720", change: "+15.3%", icon: DollarSign },
]

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform metrics and performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <stat.icon className="size-5 text-muted-foreground" />
                <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3 text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AdminChart />
    </div>
  )
}
