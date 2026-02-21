"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DICT, type I18nKey, type Lang } from "@/lib/i18n";

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: I18nKey) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && window.localStorage.getItem("zippixel_lang")) || "en";
    if (["en","tr","de","fr","es","ru"].includes(stored)) setLangState(stored as Lang);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("zippixel_lang", l);
  };

  const t = useMemo(() => {
    return (k: I18nKey) => {
      const table = DICT[lang] ?? DICT.en;
      return (table as any)[k] ?? (DICT.en as any)[k] ?? String(k);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
