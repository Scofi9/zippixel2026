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
      "10 images / month",
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
      "250 images / month",
      "Max 15MB per image",
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
      "1,500 images / month",
      "Max 30MB per image",
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
      "5,000 images / month",
      "Max 70MB per image",
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
  { feature: "Max file size (per image)", free: "5MB", basic: "10MB", pro: "25MB", plus: "50MB" },
  { feature: "Formats", free: "JPG, PNG, WebP", basic: "JPG, PNG, WebP, AVIF", pro: "All modern", plus: "All modern" },
  { feature: "Compression speed", free: "Standard", basic: "Fast", pro: "Faster", plus: "Fastest" },
  { feature: "Priority queue", free: false, basic: false, pro: true, plus: true },
  { feature: "Batch upload", free: false, basic: false, pro: true, plus: true },
  { feature: "Analytics", free: false, basic: false, pro: true, plus: true },
  { feature: "Watermark", free: "No", basic: "No", pro: "No", plus: "No" },
  { feature: "Support", free: "Community", basic: "Email", pro: "Priority email", plus: "Priority + faster SLA" },
  { feature: "API access", free: "—", basic: "—", pro: "Coming soon", plus: "Coming soon" },
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
                  ? "group relative flex h-full overflow-hidden rounded-2xl border border-primary/50 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/15"
                  : "group relative flex h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/10"
              }
            >
                            {/* Premium glow + sheen */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
                <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-transparent" />
              </div>

              {plan.highlighted && (
                <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
                  <Badge className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 backdrop-blur">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className={plan.highlighted ? "relative z-10 pt-10" : "relative z-10"}>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="pb-1 text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Check className="size-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
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

          <div className="mt-10 overflow-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
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
                  <TableRow key={row.feature} className="hover:bg-white/7">
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
