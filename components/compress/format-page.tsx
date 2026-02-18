import UploadZone from "@/components/compress/upload-zone"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormatPageProps {
  format: string
  title: string
  description: string
  benefits: string[]
}

export function FormatPage({ format, title, description, benefits }: FormatPageProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <div className="text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-12">
          <UploadZone defaultFormat={format} />
        </div>

        <div className="mt-16 rounded-xl border border-border/50 bg-card/50 p-8">
          <h2 className="text-xl font-semibold text-foreground">
            Why compress {format.toUpperCase()} files?
          </h2>
          <ul className="mt-6 flex flex-col gap-3">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link href="/compress">
                Try All Formats
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
