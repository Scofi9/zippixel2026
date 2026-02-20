"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/components/i18n-provider";

type OutputFormat = "auto" | "jpg" | "png" | "webp" | "avif";

type Item = {
  id: string;
  name: string;
  originalSize: number;
  compressedSize?: number;
  savings?: number;
  status: "idle" | "uploading" | "done" | "error";
  errorMsg?: string;
  downloadUrl?: string; // object URL
  outputFormat?: string;
  outputFileName?: string;
};

function bytesToKB(bytes: number) {
  return (bytes / 1024).toFixed(1);
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-() ]+/g, "_");
}

function isLimitReachedError(status: number, bodyText: string) {
  if (status !== 403) return false;
  try {
    const j = JSON.parse(bodyText);
    return j?.error === "LIMIT_REACHED";
  } catch {
    return bodyText.includes("LIMIT_REACHED");
  }
}

export default function UploadZone({ defaultFormat }: { defaultFormat?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { t } = useI18n();

  const [quality, setQuality] = useState(80);
  const initialFormat = ((): OutputFormat => {
    const v = String(defaultFormat ?? "").toLowerCase();
    if (v === "jpg" || v === "jpeg") return "jpg";
    if (v === "png") return "png";
    if (v === "webp") return "webp";
    if (v === "avif") return "avif";
    return "auto";
  })();

  const [format, setFormat] = useState<OutputFormat>(initialFormat);
  const [results, setResults] = useState<Item[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Premium UX state
  const [limitReached, setLimitReached] = useState(false);

  const pick = () => {
    if (limitReached) return;
    inputRef.current?.click();
  };

  const clearAll = () => {
    results.forEach((r) => {
      if (r.downloadUrl) URL.revokeObjectURL(r.downloadUrl);
    });
    setResults([]);
    setLimitReached(false);
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadAll = () => {
    const done = results.filter((r) => r.status === "done" && r.downloadUrl);
    done.forEach((r) =>
      triggerDownload(r.downloadUrl!, r.outputFileName ?? `zippixel-${safeFileName(r.name)}`)
    );
  };

  const prettyFormat = useMemo(() => {
    if (format === "auto") return t("auto_best");
    return format.toUpperCase();
  }, [format, t]);

  const qualityLabel = useMemo(() => {
    if (quality >= 85) return "Ultra";
    if (quality >= 70) return "Balanced";
    return "Small";
  }, [quality]);

  const compressOne = async (file: File, id: string) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("quality", String(quality));
      fd.append("format", format);

      const res = await fetch("/api/compress", { method: "POST", body: fd });

      if (!res.ok) {
        const text = await res.text().catch(() => "");

        // LIMIT_REACHED => premium mesaj + upload kilidi
        if (isLimitReachedError(res.status, text)) {
          setLimitReached(true);

          setResults((prev) =>
            prev.map((r) =>
              r.id === id
                ? {
                    ...r,
                    status: "error",
                    errorMsg:
                      "Monthly limit reached. Upgrade your plan to continue.",
                  }
                : r
            )
          );

          // Bu durumda queue'daki diğerlerini de "limit" diye işaretleyeceğiz (UX)
          setResults((prev) =>
            prev.map((r) =>
              r.status === "uploading"
                ? {
                    ...r,
                    status: "error",
                    errorMsg:
                      "Monthly limit reached. Upgrade your plan to continue.",
                  }
                : r
            )
          );

          return "LIMIT_REACHED" as const;
        }

        if (res.status === 413) {
          throw new Error(t("err_too_large"));
        }
        throw new Error(text ? text.slice(0, 180) : `${t("err_generic")} (${res.status})`);
      }

      const blob = await res.blob();

      const outputFormat = res.headers.get("X-Output-Format") ?? undefined;
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const outputFileName = match?.[1] ?? undefined;

      // Başarılı compress sonrası usage artır
      const usageRes = await fetch("/api/usage/increment", { method: "POST" });
      if (!usageRes.ok) {
        const t = await usageRes.text().catch(() => "");
        if (isLimitReachedError(usageRes.status, t)) {
          setLimitReached(true);
        }
      }

      const compressedSize = blob.size;
      const savings = Math.max(
        0,
        Math.min(100, Math.round(((file.size - compressedSize) / file.size) * 100))
      );

      const url = URL.createObjectURL(blob);

      setResults((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "done",
                compressedSize,
                savings,
                downloadUrl: url,
                outputFormat,
                outputFileName,
              }
            : r
        )
      );

      return "OK" as const;
    } catch (e: any) {
      setResults((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "error",
                errorMsg: e?.message ?? "Compression failed",
              }
            : r
        )
      );
      return "ERROR" as const;
    }
  };

  const onFiles = async (files: FileList | null) => {
    if (limitReached) return;
    if (!files || files.length === 0) return;

    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    const items: Item[] = list.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      originalSize: f.size,
      status: "uploading",
    }));

    setResults((prev) => [...items, ...prev]);
    setIsProcessing(true);

    // sırayla compress
    for (let i = 0; i < list.length; i++) {
      const result = await compressOne(list[i], items[i].id);
      if (result === "LIMIT_REACHED") break; // limit dolduysa devam etme
    }

    setIsProcessing(false);

    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (limitReached) return;
    setIsDragging(false);
    void onFiles(e.dataTransfer.files);
  };

  const doneCount = results.filter((r) => r.status === "done" && r.downloadUrl).length;

  return (
    <div className="w-full">
      {/* Premium limit banner */}
      {limitReached && (
        <div className="mb-4 rounded-xl border border-border bg-background/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold">Monthly limit reached</div>
              <div className="text-sm text-muted-foreground">
                You’ve used all compressions included in your plan. Upgrade to keep compressing.
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild>
                <Link href="/pricing?reason=limit">View plans</Link>
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        className={[
          "rounded-2xl border border-dashed p-10 text-center transition",
          isDragging ? "border-primary/60 bg-primary/5" : "border-border/70",
          limitReached ? "opacity-60" : "",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          if (limitReached) return;
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          pick();
        }}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-xl">
          ↑
        </div>

        <div className="mt-4 text-lg font-semibold">
          {limitReached ? "Upgrade required" : t("upload_drop")}
        </div>

        <div className="mt-1 text-sm text-muted-foreground">
          {limitReached
            ? "You’ve hit your monthly limit."
            : t("upload_supports")}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => void onFiles(e.target.files)}
          disabled={limitReached}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            pick();
          }}
          disabled={limitReached}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
        >
          {t("upload_browse")}
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background/40 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("quality")}</div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">{qualityLabel}</Badge>
              <div className="text-sm font-semibold">{quality}%</div>
            </div>
          </div>
          <div className="mt-4">
            <Slider
              value={[quality]}
              min={10}
              max={95}
              step={1}
              onValueChange={(v) => setQuality(v[0] ?? 80)}
              disabled={limitReached}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Lower quality = smaller file size. 80% recommended.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/40 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{t("output_format")}</div>
            <Badge variant="secondary" className="text-xs">{prettyFormat}</Badge>
          </div>
          <div className="mt-3">
            <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
              <SelectTrigger disabled={limitReached}>
                <SelectValue placeholder={t("output_format")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">{t("auto_best")}</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="avif">AVIF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Auto selects a reasonable output format.
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">
            {t("results")} ({results.length})
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              {t("clear")}
            </button>

            <button
              type="button"
              onClick={downloadAll}
              disabled={doneCount === 0}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {t("download_all")}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 pr-4">{t("file")}</th>
                <th className="py-2 pr-4">{t("original")}</th>
                <th className="py-2 pr-4">{t("compressed")}</th>
                <th className="py-2 pr-4">{t("savings")}</th>
                <th className="py-2 pr-4">{t("status")}</th>
                <th className="py-2">{t("download")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="py-3 pr-4">{r.name}</td>
                  <td className="py-3 pr-4">{bytesToKB(r.originalSize)} KB</td>
                  <td className="py-3 pr-4">
                    {r.compressedSize ? `${bytesToKB(r.compressedSize)} KB` : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    {r.status === "done" ? `${r.savings ?? 0}%` : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    {r.status === "uploading" && t("working")}
                    {r.status === "done" && t("done")}
                    {r.status === "error" && (
                      <span className="text-muted-foreground">
                        {r.errorMsg ?? "Compression failed"}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {r.status === "done" && r.downloadUrl ? (
                      <button
                        className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
                        onClick={() =>
                          triggerDownload(
                            r.downloadUrl!,
                            r.outputFileName ?? `zippixel-${safeFileName(r.name)}`
                          )
                        }
                      >
                        {t("download")}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    {t("no_files")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isProcessing && (
          <div className="mt-4 text-sm text-muted-foreground">Compressing…</div>
        )}
      </div>
    </div>
  );
}