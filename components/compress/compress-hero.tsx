"use client";

import { useI18n } from "@/components/i18n-provider";

export function CompressHero() {
  const { t } = useI18n();
  return (
    <div className="text-center">
      <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
        {t("compress_h1")}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
        {t("compress_p")}
      </p>
    </div>
  );
}
