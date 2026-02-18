"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const usageData = [
  { month: "Sep", users: 8200, compressions: 180000 },
  { month: "Oct", users: 9100, compressions: 220000 },
  { month: "Nov", users: 10200, compressions: 280000 },
  { month: "Dec", users: 10800, compressions: 310000 },
  { month: "Jan", users: 11900, compressions: 380000 },
  { month: "Feb", users: 12847, compressions: 420000 },
]

const revenueData = [
  { month: "Sep", revenue: 32000 },
  { month: "Oct", revenue: 36000 },
  { month: "Nov", revenue: 39500 },
  { month: "Dec", revenue: 41200 },
  { month: "Jan", revenue: 45100 },
  { month: "Feb", revenue: 48720 },
]

export function AdminChart() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">User Growth</CardTitle>
          <CardDescription>Total registered users per month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
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
                <Bar dataKey="users" fill="oklch(0.75 0.18 155)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Revenue</CardTitle>
          <CardDescription>Monthly recurring revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.005 260)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.11 0.005 260)",
                    border: "1px solid oklch(0.22 0.005 260)",
                    borderRadius: "8px",
                    color: "oklch(0.97 0 0)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="oklch(0.75 0.18 155)" strokeWidth={2} dot={{ fill: "oklch(0.75 0.18 155)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
