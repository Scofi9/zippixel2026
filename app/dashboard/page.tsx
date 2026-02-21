import type { Metadata } from "next"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { Settings, History, ArrowUpRight } from "lucide-react"

import { PLANS, type PlanKey } from "@/lib/plans"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your ZipPixel account, usage, and billing.",
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n))
}

export default async function DashboardPage() {
  const user = await currentUser()

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

  const planKeyRaw = (user.publicMetadata?.plan as PlanKey) ?? "free"
  const safePlanKey: PlanKey = (["free", "basic", "pro", "plus"] as const).includes(planKeyRaw)
    ? planKeyRaw
    : "free"

  const plan = PLANS[safePlanKey]

  const usageThisMonth = Number(user.publicMetadata?.usageThisMonth ?? 0) || 0
  const limit = plan.monthlyLimitImages
  // Eski bug yüzünden metadata limit üstüne çıkmış olabilir -> UI’da clamp
  const usageShown = limit > 0 ? Math.min(usageThisMonth, limit) : usageThisMonth
  const percent = clamp(limit > 0 ? (usageShown / limit) * 100 : 0)

  const isFree = safePlanKey === "free"
  const isLimitReached = limit > 0 && usageThisMonth >= limit
  const remaining = Math.max(0, limit - usageShown)

  const primaryEmail = user.emailAddresses?.[0]?.emailAddress ?? ""
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          {isFree && isLimitReached ? (
            <Button asChild>
              <Link href="/pricing?reason=limit">
                Upgrade to continue <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="secondary">
              <Link href="/pricing?from=dashboard">
                Upgrade plan <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">Manage your account, plan, and monthly usage.</p>
      </div>

      {/* Limit dolunca: net yükseltme kutusu */}
      {isFree && isLimitReached && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Monthly limit reached
              <Badge variant="secondary">
                {usageShown.toLocaleString()} / {limit.toLocaleString()}
              </Badge>
            </CardTitle>
            <CardDescription>
              Free plan monthly limit is full. Upgrade your plan to keep compressing images.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              You can upgrade instantly and continue without losing access.
            </div>
            <Button asChild>
              <Link href="/pricing?reason=limit">View plans</Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
              <Link href="/pricing?from=dashboard">Manage plan</Link>
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
              <div className="text-2xl font-semibold">{usageShown.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">/ {limit.toLocaleString()}</div>
            </div>

            <Progress value={percent} />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Remaining this month</span>
              <span className="font-medium">{remaining.toLocaleString()}</span>
            </div>

            {isFree && isLimitReached ? (
              <div className="text-xs">
                <Link className="underline underline-offset-4" href="/pricing?reason=limit">
                  Limit is full. Upgrade to continue.
                </Link>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Usage updates automatically after each successful compression.
              </div>
            )}
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
            <div className="text-xs text-muted-foreground">Plan/usage are stored in Clerk metadata for now.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Jump to the important sections.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/dashboard/history">
                <History className="mr-2 h-4 w-4" /> History
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