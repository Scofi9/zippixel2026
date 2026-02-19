import Link from "next/link"
import { ArrowRight, ImageDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.12_220_/_0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
            <ImageDown className="size-3.5" />
            <span>AI-Powered Compression Engine</span>
          </div>

          {/* biraz küçülttüm */}
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            Compress images without losing quality
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Reduce image file size up to 90% with AI-powered compression. Support for JPG,
            PNG, WebP, and AVIF formats. Free to start.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* premium hover */}
            <Button
              asChild
              className="h-12 rounded-xl px-8 text-base font-semibold
              bg-primary text-primary-foreground shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110
              active:translate-y-0"
            >
              <Link href="/compress">
                Compress Images Now
              </Link>
            </Button> 

            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl px-8 text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              asChild
            >
              <Link href="/features">See How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}