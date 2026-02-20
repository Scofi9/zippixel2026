import Link from "next/link"
import { Check } from "lucide-react"
import { PLANS, type PlanKey } from "@/lib/plans"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ORDER: PlanKey[] = ["free", "basic", "pro", "plus"]

const PRICE: Record<PlanKey, string> = {
  free: "$0",
  basic: "$4",
  pro: "$9",
  plus: "$19",
}

const DESC: Record<PlanKey, string> = {
  free: "Try ZipPixel with a strict monthly limit.",
  basic: "For small creators getting serious.",
  pro: "For professionals who compress daily.",
  plus: "For power users & agencies.",
}

const CTA: Record<PlanKey, { label: string; href: string }> = {
  free: { label: "Get Started", href: "/compress" },
  basic: { label: "Upgrade to Basic", href: "/pricing" },
  pro: { label: "Start Pro", href: "/pricing" },
  plus: { label: "Go Plus", href: "/pricing" },
}

export function PricingPreview() {
  return (
    <section className="border-y border-border/50 bg-secondary/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Start free. Upgrade when you hit the limit.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ORDER.map((key) => {
            const plan = PLANS[key]
            const highlighted = key === "pro"

            const features = [
              `${plan.monthlyLimitImages.toLocaleString()} images / month`,
              `Max ${plan.maxFileMb}MB per image`,
              key === "free" ? "JPG, PNG, WebP" : "JPG, PNG, WebP, AVIF",
              highlighted || key === "plus" ? "Priority processing" : "Standard processing",
            ]

            return (
              <Card
                key={key}
                className={
                  highlighted ? "relative border-primary/50 bg-card" : "border-border/50 bg-card/50"
                }
              >
                {highlighted && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{DESC[key]}</CardDescription>

                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{PRICE[key]}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="flex flex-col gap-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5">
                        <Check className="size-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="mt-8 w-full"
                    variant={highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href={CTA[key].href}>{CTA[key].label}</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}