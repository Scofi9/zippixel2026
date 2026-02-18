import type { Metadata } from "next"
import { CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "System Status — Service Health",
  description:
    "ZipPixel system status and uptime. Monitor the health of our compression API, dashboard, and CDN services.",
  openGraph: {
    title: "System Status — ZipPixel",
    description: "Real-time system status and uptime monitoring.",
    url: "https://zippixel.com/status",
  },
  alternates: { canonical: "https://zippixel.com/status" },
}

const services = [
  { name: "Compression API", status: "operational", uptime: "99.99%" },
  { name: "Web Dashboard", status: "operational", uptime: "99.98%" },
  { name: "CDN / File Delivery", status: "operational", uptime: "99.99%" },
  { name: "Authentication", status: "operational", uptime: "99.97%" },
  { name: "Webhooks", status: "operational", uptime: "99.95%" },
  { name: "Analytics", status: "operational", uptime: "99.96%" },
]

const incidents = [
  {
    date: "Feb 12, 2026",
    title: "Elevated API latency in EU region",
    status: "Resolved",
    description:
      "We experienced elevated latency for API requests routed through our EU-West data center. The issue was resolved by scaling our processing fleet.",
  },
  {
    date: "Jan 28, 2026",
    title: "Scheduled maintenance window",
    status: "Completed",
    description:
      "We performed routine database maintenance. The service was briefly unavailable for approximately 3 minutes during the maintenance window.",
  },
]

export default function StatusPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            System Status
          </h1>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <CheckCircle2 className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              All Systems Operational
            </span>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3">
          {services.map((service) => (
            <Card key={service.name} className="border-border/50 bg-card/50">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="size-2.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {service.uptime} uptime
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary text-xs"
                  >
                    Operational
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Incidents
          </h2>
          <div className="mt-6 flex flex-col gap-6">
            {incidents.map((incident) => (
              <Card
                key={incident.title}
                className="border-border/50 bg-card/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {incident.date}
                  </div>
                  <CardTitle className="text-base">{incident.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {incident.description}
                  </p>
                  <Badge variant="secondary" className="mt-3">
                    {incident.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
