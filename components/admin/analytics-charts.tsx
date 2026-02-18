"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const dailyData = [
  { day: "Mon", dau: 2800, compressions: 35000 },
  { day: "Tue", dau: 3100, compressions: 38000 },
  { day: "Wed", dau: 3400, compressions: 42000 },
  { day: "Thu", dau: 3200, compressions: 40000 },
  { day: "Fri", dau: 3500, compressions: 44000 },
  { day: "Sat", dau: 2400, compressions: 28000 },
  { day: "Sun", dau: 2100, compressions: 24000 },
]

const formatData = [
  { name: "JPG", value: 45, color: "oklch(0.75 0.18 155)" },
  { name: "PNG", value: 28, color: "oklch(0.6 0.118 184.704)" },
  { name: "WebP", value: 18, color: "oklch(0.55 0.07 260)" },
  { name: "AVIF", value: 9, color: "oklch(0.828 0.189 84.429)" },
]

export function AdminAnalyticsCharts() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border/50 bg-card/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Daily Active Users</CardTitle>
          <CardDescription>Users and compressions over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.18 155)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.75 0.18 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.11 0.005 260)",
                    border: "1px solid oklch(0.22 0.005 260)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0 0)",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="dau" stroke="oklch(0.75 0.18 155)" strokeWidth={2} fillOpacity={1} fill="url(#colorDau)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Format Distribution</CardTitle>
          <CardDescription>Compression by image format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={formatData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {formatData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.11 0.005 260)",
                    border: "1px solid oklch(0.22 0.005 260)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0 0)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {formatData.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                  <span className="text-muted-foreground">{f.name}</span>
                </div>
                <span className="font-mono text-foreground">{f.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
