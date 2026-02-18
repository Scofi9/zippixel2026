import type { Metadata } from "next"
import Link from "next/link"
import {
  Zap,
  Shield,
  Image,
  Layers,
  Globe,
  Lock,
  Cpu,
  BarChart3,
  ArrowRight,
  Code2,
  Palette,
  Gauge,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Features — AI-Powered Image Compression",
  description:
    "Explore ZipPixel features: AI compression, batch processing, multi-format support, API access, and more. Built for developers and teams.",
  openGraph: {
    title: "Features — ZipPixel",
    description: "AI-powered image compression with batch processing, multi-format support, and API access.",
    url: "https://zippixel.com/features",
  },
  alternates: { canonical: "https://zippixel.com/features" },
}

const features = [
  {
    icon: Cpu,
    title: "AI-Powered Engine",
    description:
      "Our neural network analyzes each image and selects the optimal compression strategy. Trained on millions of images for the best results.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Process images in under 2 seconds. Our distributed infrastructure ensures consistent speed regardless of load.",
  },
  {
    icon: Image,
    title: "Multi-Format Support",
    description:
      "JPG, PNG, WebP, AVIF, GIF, SVG, TIFF, and more. Convert between formats or let our AI choose the best one.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description:
      "Upload and compress hundreds of images at once. Queue management and progress tracking built in.",
  },
  {
    icon: Code2,
    title: "REST API",
    description:
      "Full API access with SDKs for JavaScript, Python, Go, Ruby, and PHP. Webhooks and real-time events supported.",
  },
  {
    icon: Shield,
    title: "Lossless Mode",
    description:
      "When every pixel matters, use lossless compression to reduce file size without any quality degradation.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified. TLS 1.3 encryption, automatic file deletion, GDPR compliant. Your data is always safe.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track compression stats, savings over time, format distribution, and usage across your team.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description:
      "Process images from the edge for minimal latency. 30+ data centers worldwide for fast uploads.",
  },
  {
    icon: Palette,
    title: "Smart Resize",
    description:
      "Automatically resize images to your target dimensions while compressing. Perfect for responsive images.",
  },
  {
    icon: Gauge,
    title: "Web Vitals Optimized",
    description:
      "Images optimized specifically for Core Web Vitals. Improve LCP, CLS, and page speed scores.",
  },
  {
    icon: Layers,
    title: "Team Workspaces",
    description:
      "Collaborate with your team. Shared compression presets, usage reports, and centralized billing.",
  },
]

export default function FeaturesPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Built for speed, quality, and scale
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Every feature designed to help you deliver optimized images faster
            than ever before.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/50 bg-card/50 transition-colors hover:border-primary/20"
            >
              <CardContent className="pt-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-20 text-center">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/compress">
              Try ZipPixel Free
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
