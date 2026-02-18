import type { Metadata } from "next"
import Link from "next/link"
import { Check, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = {
  title: "Pricing — Simple, Transparent Plans",
  description:
    "ZipPixel pricing: Free, Pro, and Enterprise plans. Start compressing images for free. No hidden fees.",
  openGraph: {
    title: "Pricing — ZipPixel",
    description: "Simple, transparent pricing. Start free, scale as you grow.",
    url: "https://zippixel.com/pricing",
  },
  alternates: { canonical: "https://zippixel.com/pricing" },
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and testing.",
    features: [
      "50 images per month",
      "Max 5MB per image",
      "JPG & PNG formats",
      "Standard compression",
      "Web upload only",
    ],
    cta: "Get Started",
    href: "/compress",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    description: "For professionals and growing teams.",
    features: [
      "5,000 images per month",
      "Max 50MB per image",
      "All formats supported",
      "AI-powered compression",
      "Full API access",
      "Priority support",
      "Team workspace (3 seats)",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    href: "/compress",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with large-scale needs.",
    features: [
      "Unlimited images",
      "No file size limit",
      "All formats + custom models",
      "Dedicated infrastructure",
      "SLA guarantee (99.99%)",
      "24/7 premium support",
      "Unlimited team seats",
      "Custom integrations",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    href: "/docs",
    highlighted: false,
  },
]

const comparison = [
  { feature: "Monthly images", free: "50", pro: "5,000", enterprise: "Unlimited" },
  { feature: "Max file size", free: "5MB", pro: "50MB", enterprise: "No limit" },
  { feature: "Formats", free: "JPG, PNG", pro: "All", enterprise: "All + Custom" },
  { feature: "AI compression", free: false, pro: true, enterprise: true },
  { feature: "API access", free: false, pro: true, enterprise: true },
  { feature: "Batch upload", free: false, pro: true, enterprise: true },
  { feature: "Analytics", free: false, pro: true, enterprise: true },
  { feature: "Team workspace", free: false, pro: "3 seats", enterprise: "Unlimited" },
  { feature: "Priority support", free: false, pro: true, enterprise: true },
  { feature: "SLA", free: false, pro: false, enterprise: "99.99%" },
  { feature: "Custom models", free: false, pro: false, enterprise: true },
]

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") return <span>{value}</span>
  if (value) return <Check className="mx-auto size-4 text-primary" />
  return <Minus className="mx-auto size-4 text-muted-foreground/30" />
}

export default function PricingPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Start free. Scale as you grow. No hidden fees, no surprise charges.
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
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{f}</span>
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

        {/* Comparison Table */}
        <div className="mt-24">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            Compare plans
          </h2>
          <div className="mt-10 overflow-auto rounded-xl border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  <TableHead className="text-center">Free</TableHead>
                  <TableHead className="text-center">Pro</TableHead>
                  <TableHead className="text-center">Enterprise</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map((row) => (
                  <TableRow key={row.feature}>
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.free} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.pro} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.enterprise} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  )
}
