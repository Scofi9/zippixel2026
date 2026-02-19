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
    "ZipPixel pricing: Free, Basic, Pro, and Plus plans. Start compressing images for free. No hidden fees.",
  openGraph: {
    title: "Pricing — ZipPixel",
    description: "Simple, transparent pricing. Start free, scale as you grow.",
    url: "https://zippixel.xyz/pricing",
  },
  alternates: { canonical: "https://zippixel.xyz/pricing" },
}

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and testing.",
    features: [
      "50 images / month",
      "Max 5MB per image",
      "JPG, PNG, WebP",
      "Standard compression",
      "Web upload",
    ],
    cta: "Get Started",
    href: "/compress",
    highlighted: false,
  },
  {
    name: "Basic",
    price: "$4",
    period: "/month",
    description: "For small sites and creators getting serious.",
    features: [
      "300 images / month",
      "Max 10MB per image",
      "JPG, PNG, WebP, AVIF",
      "Faster compression",
      "Web upload",
    ],
    cta: "Upgrade to Basic",
    href: "/compress",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For professionals who compress daily.",
    features: [
      "2,000 images / month",
      "Max 25MB per image",
      "All modern formats",
      "Priority processing",
      "Batch upload",
      "Analytics dashboard",
    ],
    cta: "Start Pro",
    href: "/compress",
    highlighted: true,
  },
  {
    name: "Plus",
    price: "$19",
    period: "/month",
    description: "For power users & agencies with heavy volume.",
    features: [
      "10,000 images / month",
      "Max 50MB per image",
      "All modern formats",
      "Highest priority queue",
      "Batch upload",
      "Advanced analytics",
    ],
    cta: "Go Plus",
    href: "/compress",
    highlighted: false,
  },
]

const comparison = [
  { feature: "Monthly images", free: "50", basic: "300", pro: "2,000", plus: "10,000" },
  { feature: "Max file size", free: "5MB", basic: "10MB", pro: "25MB", plus: "50MB" },
  { feature: "Formats", free: "JPG, PNG, WebP", basic: "JPG, PNG, WebP, AVIF", pro: "All modern", plus: "All modern" },
  { feature: "Priority processing", free: false, basic: false, pro: true, plus: true },
  { feature: "Batch upload", free: false, basic: false, pro: true, plus: true },
  { feature: "Analytics", free: false, basic: false, pro: true, plus: true },
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
            Start free. Upgrade only when you hit real limits.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "group relative overflow-hidden rounded-2xl border border-primary/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-2xl hover:shadow-primary/15"
                  : "group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card hover:shadow-2xl hover:shadow-primary/10"
              }
            >
              {/* Premium glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              </div>

              {plan.highlighted && (
                <div className="absolute -top-3 left-6 z-10">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="relative z-10">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="pb-1 text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
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

                {/* subtle bottom highlight */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="h-full w-full bg-gradient-to-t from-primary/10 to-transparent" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-24">
          <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
            Compare plans
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
            Clear limits, no surprises. Upgrade when you need more volume or bigger files.
          </p>

          <div className="mt-10 overflow-auto rounded-xl border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Feature</TableHead>
                  <TableHead className="text-center">Free</TableHead>
                  <TableHead className="text-center">Basic</TableHead>
                  <TableHead className="text-center">Pro</TableHead>
                  <TableHead className="text-center">Plus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparison.map((row) => (
                  <TableRow key={row.feature} className="hover:bg-white/5">
                    <TableCell className="font-medium">{row.feature}</TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.free} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.basic} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.pro} />
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <CellValue value={row.plus} />
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
