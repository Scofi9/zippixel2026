import {
  Zap,
  Shield,
  Image,
  Layers,
  Globe,
  Lock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Compress images in under 2 seconds with our optimized AI engine. Batch process hundreds of files at once.",
  },
  {
    icon: Image,
    title: "Multi-Format Support",
    description:
      "Supports JPG, PNG, WebP, AVIF, and more. Automatically detect and optimize each format.",
  },
  {
    icon: Shield,
    title: "Lossless Quality",
    description:
      "Our AI preserves visual quality while dramatically reducing file size. No visible difference.",
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description:
      "Upload and compress hundreds of images at once. Perfect for teams and large-scale projects.",
  },
  {
    icon: Globe,
    title: "API Access",
    description:
      "Integrate image compression into your workflow with our REST API. SDKs for all major languages.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "All images are encrypted in transit and deleted after processing. Your data never leaves our servers.",
  },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to optimize images
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Built for developers, designers, and teams who need fast, reliable
            image compression at scale.
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
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
