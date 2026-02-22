"use client"

import Link from "next/link"
import { ImageDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative overflow-hidden border-b border-border/50 py-16 sm:py-20 lg:py-28">
      {/* vivid blue background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.22),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary/70 px-4 py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur">
              <ImageDown className="size-3.5" />
              <span>{t("hero_badge")}</span>
            </div>

            <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {t("hero_title")}
            </h1>

            <p className="mt-5 sm:mt-6 text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground">
              {t("hero_subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 sm:h-12 rounded-xl px-7 sm:px-8 text-base font-semibold">
                <Link href="/compress">{t("hero_cta_primary")}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 sm:h-12 rounded-xl px-7 sm:px-8 text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                <Link href="/crop">{t("nav_crop")}</Link>
              </Button>
              <Button variant="ghost" size="lg" className="h-11 sm:h-12 rounded-xl px-7 sm:px-8" asChild>
                <Link href="/features">{t("hero_cta_secondary")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-r from-sky-500/12 via-blue-500/12 to-indigo-500/12 blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-border/50 bg-background/40 p-3 shadow-xl backdrop-blur">
              <div className="relative overflow-hidden rounded-2xl">
                {/* Video preview (loop) */}
                <video
                  className="h-auto w-full select-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster="/hero-tools.svg"
                >
                  <source src="/hero-demo.webm" type="video/webm" />
                  <source src="/hero-demo.mp4" type="video/mp4" />
                </video>

                {/* subtle sheen */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
