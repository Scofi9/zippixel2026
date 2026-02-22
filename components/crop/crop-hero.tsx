"use client";

import { useI18n } from "@/components/i18n-provider";

export function CropHero() {
  const { t } = useI18n();
  return (
    <div className="text-center">
      <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">{t("crop_h1")}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">{t("crop_p")}</p>
    </div>
  );
}
