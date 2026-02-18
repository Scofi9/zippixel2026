import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="border-t border-border/50 bg-secondary/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Start compressing images today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
          Join 50,000+ developers and teams using ZipPixel to optimize their
          images. Free to start, no credit card required.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/compress">
              Compress Images Now
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base"
            asChild
          >
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
