import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal projects",
    features: [
      "50 images per month",
      "Max 5MB per image",
      "JPG & PNG formats",
      "Standard compression",
    ],
    cta: "Get Started",
    href: "/compress",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    description: "For professionals and small teams",
    features: [
      "5,000 images per month",
      "Max 50MB per image",
      "All formats supported",
      "AI-powered compression",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/pricing",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large-scale operations",
    features: [
      "Unlimited images",
      "No file size limit",
      "All formats supported",
      "Custom AI models",
      "Dedicated infrastructure",
      "SLA & 24/7 support",
    ],
    cta: "Contact Sales",
    href: "/pricing",
    highlighted: false,
  },
]

export function PricingPreview() {
  return (
    <section className="border-y border-border/50 bg-secondary/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative border-primary/50 bg-card"
                  : "border-border/50 bg-card/50"
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-6">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
