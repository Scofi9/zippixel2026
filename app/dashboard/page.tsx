import type { Metadata } from "next"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { CreditCard, Image as ImageIcon, Settings, History, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your ZipPixel account, usage, and billing.",
}

type PlanKey = "free" | "basic" | "pro" | "plus"

const PLANS: Record<
  PlanKey,
  {
    name: string
    monthlyLimitImages: number
    maxFileMb: number
  }
> = {
  free: { name: "Free", monthlyLimitImages: 50, maxFileMb: 5 },
  basic: { name: "Basic", monthlyLimitImages: 300, maxFileMb: 10 },
  pro: { name: "Pro", monthlyLimitImages: 2000, maxFileMb: 25 },
  plus: { name: "Plus", monthlyLimitImages: 10000, maxFileMb: 50 },
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export default async function DashboardPage() {
  const user = await currentUser()

  // Dashboard genelde middleware ile protected olur ama yine de güvenli kalsın:
  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
            <CardDescription>To view your dashboard, please sign in.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/sign-in">Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Plan / usage şimdilik Clerk metadata’dan okunur (yoksa Free/0)
  const planKey = (user.publicMetadata?.plan as PlanKey) ?? "free"
  const safePlanKey: PlanKey = (["free", "basic", "pro", "plus"] as const).includes(planKey)
    ? planKey
    : "free"

  const plan = PLANS[safePlanKey]

  const usageThisMonth = Number(user.publicMetadata?.usageThisMonth ?? 0) || 0
  const limit = plan.monthlyLimitImages
  const percent = clamp(limit > 0 ? (usageThisMonth / limit) * 100 : 0)

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress ?? ""
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <Button asChild variant="secondary">
            <Link href="/dashboard/billing">
              Upgrade plan <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your account, plan, and monthly usage.
        </p>
      </div>

      {/* Overview cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current plan
              <Badge variant={safePlanKey === "pro" || safePlanKey === "plus" ? "default" : "secondary"}>
                {plan.name}
              </Badge>
            </CardTitle>
            <CardDescription>Monthly limits and max file size.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Monthly images: </span>
              <span className="font-medium">{plan.monthlyLimitImages.toLocaleString()}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Max file size: </span>
              <span className="font-medium">{plan.maxFileMb}MB</span>
            </div>
            <Button asChild className="mt-2 w-full">
              <Link href="/dashboard/billing">Manage billing</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage this month</CardTitle>
            <CardDescription>Images compressed in the current billing cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="text-2xl font-semibold">{usageThisMonth.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                / {limit.toLocaleString()}
              </div>
            </div>
            <Progress value={percent} />
            <div className="text-xs text-muted-foreground">
              Tracking is ready. We’ll connect this to real compression events next.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your signed-in identity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium">{fullName || "—"}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{primaryEmail || "—"}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Plan/usage are stored in Clerk metadata for now.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to the important sections.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/files">
                <ImageIcon className="mr-2 h-4 w-4" /> Files
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/history">
                <History className="mr-2 h-4 w-4" /> History
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" /> Billing
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}