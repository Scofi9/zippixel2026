"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n-provider"

export function CTA() {
  const { t } = useI18n()

  return (
    <section className="border-t border-border/50 bg-secondary/30 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-balance text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
          {t("cta_title")}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base sm:text-lg text-muted-foreground">
          {t("cta_subtitle")}
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="h-11 sm:h-12 w-full sm:w-auto px-7 sm:px-8 text-base" asChild>
            <Link href="/compress">
              {t("cta_button")}
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-11 sm:h-12 w-full sm:w-auto px-7 sm:px-8 text-base" asChild>
            <Link href="/pricing">{t("nav_pricing")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
