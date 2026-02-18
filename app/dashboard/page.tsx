import type { Metadata } from "next"
import { ImageDown, TrendingUp, HardDrive, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your ZipPixel image compression dashboard.",
}

const stats = [
  {
    label: "Images Compressed",
    value: "2,847",
    change: "+12.3%",
    icon: ImageDown,
  },
  {
    label: "Data Saved",
    value: "4.2 GB",
    change: "+8.7%",
    icon: TrendingUp,
  },
  {
    label: "Storage Used",
    value: "1.8 GB",
    change: "36%",
    icon: HardDrive,
  },
  {
    label: "Avg Compression",
    value: "78%",
    change: "+2.1%",
    icon: Zap,
  },
]

const recentActivity = [
  {
    file: "hero-banner.jpg",
    original: "3.2 MB",
    compressed: "680 KB",
    savings: "79%",
    date: "2 min ago",
  },
  {
    file: "product-photo-01.png",
    original: "5.1 MB",
    compressed: "890 KB",
    savings: "83%",
    date: "15 min ago",
  },
  {
    file: "team-photo.webp",
    original: "2.8 MB",
    compressed: "420 KB",
    savings: "85%",
    date: "1 hour ago",
  },
  {
    file: "bg-pattern.png",
    original: "1.2 MB",
    compressed: "180 KB",
    savings: "85%",
    date: "3 hours ago",
  },
  {
    file: "screenshot-dashboard.jpg",
    original: "4.5 MB",
    compressed: "920 KB",
    savings: "80%",
    date: "5 hours ago",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your compression activity and usage.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <stat.icon className="size-5 text-muted-foreground" />
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-3 text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <DashboardChart />

      {/* Storage & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Storage */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Storage Usage</CardTitle>
            <CardDescription>1.8 GB of 5.0 GB used</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={36} className="h-2" />
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">JPG files</span>
                <span className="font-mono text-foreground">820 MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">PNG files</span>
                <span className="font-mono text-foreground">540 MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">WebP files</span>
                <span className="font-mono text-foreground">320 MB</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AVIF files</span>
                <span className="font-mono text-foreground">120 MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest compression jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead className="text-right">Original</TableHead>
                  <TableHead className="text-right">Compressed</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">
                    When
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((item) => (
                  <TableRow key={item.file}>
                    <TableCell className="font-medium text-sm">
                      {item.file}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {item.original}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {item.compressed}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary text-xs"
                      >
                        -{item.savings}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">
                      {item.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
