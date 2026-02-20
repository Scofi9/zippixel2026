"use client"

import Link from "next/link"
import { ImageDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden border-b border-border/50 py-20 sm:py-24 lg:py-32">
      {/* soft premium glow (light & dark) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.10_255_/_0.18),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.70_0.12_255_/_0.10),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/80 px-4 py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur">
            <ImageDown className="size-3.5" />
            <span>{t("hero_badge")}</span>
          </div>

          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("hero_title")}
          </h1>

          <p className="mx-auto mt-5 sm:mt-6 max-w-xl text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground">
            {t("hero_subtitle")}
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-11 sm:h-12 w-full sm:w-auto rounded-xl px-7 sm:px-8 text-base font-semibold shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110
              active:translate-y-0"
            >
              <Link href="/compress">{t("hero_cta_primary")}</Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-11 sm:h-12 w-full sm:w-auto rounded-xl px-7 sm:px-8 text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              asChild
            >
              <Link href="/features">{t("hero_cta_secondary")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
