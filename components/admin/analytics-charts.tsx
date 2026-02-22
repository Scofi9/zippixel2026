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

export type DailyPoint = {
  day: string
  dau: number
  pageviews: number
  logins: number
  compressions: number
  crops: number
  downloads: number
  ops: number
}
export type FormatPoint = { name: string; value: number; color: string }

export function AdminAnalyticsCharts({ dailyData, formatData }: { dailyData: DailyPoint[]; formatData: FormatPoint[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border/50 bg-card/50 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Daily Active Users</CardTitle>
          <CardDescription>Uniques and operations over the last 7 days</CardDescription>
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
                  <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.16 255)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="oklch(0.75 0.16 255)" stopOpacity={0} />
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
                <Area type="monotone" dataKey="ops" stroke="oklch(0.75 0.16 255)" strokeWidth={2} fillOpacity={1} fill="url(#colorOps)" />
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
