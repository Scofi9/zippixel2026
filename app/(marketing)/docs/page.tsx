import type { Metadata } from "next"
import Link from "next/link"
import { Book, Code2, Zap, Key, Webhook, FileJson } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Documentation — API Reference & Guides",
  description:
    "ZipPixel API documentation. Learn how to integrate AI-powered image compression into your applications with our REST API.",
  openGraph: {
    title: "Documentation — ZipPixel",
    description: "API reference, guides, and SDKs for integrating ZipPixel image compression.",
    url: "https://zippixel.com/docs",
  },
  alternates: { canonical: "https://zippixel.com/docs" },
}

const sections = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Get up and running with ZipPixel in under 5 minutes.",
    href: "/docs",
  },
  {
    icon: Key,
    title: "Authentication",
    description: "Learn how to authenticate API requests with your API key.",
    href: "/docs",
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Complete REST API documentation with request and response examples.",
    href: "/docs",
  },
  {
    icon: FileJson,
    title: "SDKs & Libraries",
    description: "Official SDKs for JavaScript, Python, Go, Ruby, and PHP.",
    href: "/docs",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Set up webhooks to receive real-time notifications when images are processed.",
    href: "/docs",
  },
  {
    icon: Book,
    title: "Guides & Tutorials",
    description: "Step-by-step guides for common use cases and best practices.",
    href: "/docs",
  },
]

export default function DocsPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Documentation
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Everything you need to integrate ZipPixel into your applications.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link key={section.title} href={section.href}>
              <Card className="h-full border-border/50 bg-card/50 transition-colors hover:border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <section.icon className="size-5 text-primary" />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold text-foreground">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* API Example */}
        <div className="mt-24 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-center">Quick example</h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-border/50 bg-secondary/50">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <div className="size-2.5 rounded-full bg-muted-foreground/20" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">compress.js</span>
            </div>
            <pre className="overflow-auto p-6 text-sm leading-relaxed font-mono text-muted-foreground">
              <code>{`import { ZipPixel } from '@zippixel/sdk';

const client = new ZipPixel('your-api-key');

const result = await client.compress({
  source: 'https://example.com/photo.jpg',
  quality: 80,
  format: 'webp',
});

console.log(result.url);     // Compressed image URL
console.log(result.savings); // "78%"`}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}
