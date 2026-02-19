import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, KeyRound, Code2, Puzzle, Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Documentation — ZipPixel",
  description: "Everything you need to use ZipPixel effectively.",
}

const sections = [
  {
    title: "Quick Start",
    description: "Start compressing images in minutes with the web app.",
    icon: Zap,
    href: "/compress",
    badge: "Recommended",
  },
  {
    title: "Authentication",
    description: "How access works today (web app). API keys coming soon.",
    icon: KeyRound,
    href: "/pricing",
  },
  {
    title: "API Reference",
    description: "Not public yet. We’ll publish endpoints when the API is ready.",
    icon: Code2,
    href: "/pricing",
    badge: "Coming soon",
  },
  {
    title: "SDKs & Libraries",
    description: "Official SDKs are planned. For now, use the dashboard.",
    icon: Puzzle,
    href: "/pricing",
    badge: "Planned",
  },
  {
    title: "Guides",
    description: "Best practices for optimizing images and improving page speed.",
    icon: BookOpen,
    href: "/features",
  },
]

export default function DocsPage() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 text-muted-foreground">
            Clean, practical docs. We keep it real — no fake SDK snippets.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link key={s.title} href={s.href} className="group">
              <Card
                className="
                  relative h-full overflow-hidden rounded-2xl border border-white/10
                  bg-white/5 backdrop-blur
                  transition-all duration-300
                  hover:-translate-y-1 hover:hover:text-primary-400/40 hover:bg-white/10
                  hover:shadow-2xl hover:shadow-emerald-500/10
                "
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
                      <s.icon className="size-5 text-primary-400" />
                    </div>

                    {s.badge ? (
                      <Badge variant="secondary" className="bg-white/10 text-foreground">
                        {s.badge}
                      </Badge>
                    ) : null}
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.description}
                  </p>

                  <div className="mt-5 inline-flex items-center text-sm text-primary-300/90">
                    Open <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}