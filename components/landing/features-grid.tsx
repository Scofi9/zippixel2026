"use client"

import { Zap, Shield, Image, Layers, Globe, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/components/i18n-provider"

export function FeaturesGrid() {
  const { t } = useI18n()

  const features = [
    { icon: Zap, title: t("feature_fast_title"), description: t("feature_fast_desc") },
    { icon: Image, title: t("feature_formats_title"), description: t("feature_formats_desc") },
    { icon: Shield, title: t("feature_quality_title"), description: t("feature_quality_desc") },
    { icon: Layers, title: t("feature_batch_title"), description: t("feature_batch_desc") },
    { icon: Globe, title: t("feature_api_title"), description: t("feature_api_desc") },
    { icon: Lock, title: t("feature_secure_title"), description: t("feature_secure_desc") },
  ]

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
            {t("features_title")}
          </h2>
          <p className="mt-4 text-pretty text-base sm:text-lg text-muted-foreground">
            {t("features_subtitle")}
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/50 bg-card/50 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
