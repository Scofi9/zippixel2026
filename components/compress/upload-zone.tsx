"use client";

import React, { useMemo, useRef, useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Download, UploadCloud, Image as ImageIcon, Sparkles } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type OutputFormat = "auto" | "jpg" | "png" | "webp" | "avif";
type Mode = "fast" | "balanced" | "ultra";

type Item = {
  id: string;
  name: string;
  file: File;
  originalSize: number;
  originalUrl: string;
  compressedSize?: number;
  savings?: number;
  status: "idle" | "uploading" | "done" | "error";
  stage?: "analyzing" | "compressing" | "finalizing";
  errorMsg?: string;
  downloadUrl?: string; // object URL (compressed)
  outputFormat?: string;
  outputFileName?: string;
};

function formatBytes(bytes: number) {
  const b = Number(bytes || 0);
  if (!b) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), sizes.length - 1);
  return (b / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
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

function BeforeAfter({ original, compressed }: { original: string; compressed: string }) {
  const [pct, setPct] = useState(50);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const next = Math.max(0, Math.min(100, raw));
    setPct(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    // capture so it keeps dragging even if pointer leaves the line
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="w-full">
      <div
        ref={boxRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/50 bg-muted"
      >
        {/* Compressed */}
        <img
          src={compressed}
          alt="compressed"
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
        />
        {/* Original clipped */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        >
          <img
            src={original}
            alt="original"
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        <div
          className="absolute inset-y-0 w-10 -translate-x-1/2 cursor-ew-resize touch-none"
          style={{ left: `${pct}%` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="relative mx-auto h-full w-[2px] bg-white/70 dark:bg-white/60">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="grid size-8 place-items-center rounded-full border border-white/40 bg-black/40 backdrop-blur-md shadow-lg">
                <Sparkles className="size-4 text-white/90" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary">Original</Badge>
          <Badge className="bg-primary/20 text-primary border border-primary/30">Compressed</Badge>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Original</span>
          <span>Compressed</span>
        </div>
        <Slider
          value={[pct]}
          onValueChange={(v) => setPct(v[0] ?? 50)}
          min={0}
          max={100}
          step={1}
          className="mt-2"
          aria-label="Compare"
        />
      </div>
    </div>
  );
}

export default function UploadZone({ defaultFormat }: { defaultFormat?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { t } = useI18n();

  // Which result card has the premium compare view open (one at a time)
  const [openCompareId, setOpenCompareId] = useState<string | null>(null);

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
  // Default to FAST for snappier results; users can switch to Balanced/Ultra.
  const [mode, setMode] = useState<Mode>("fast");
  const [results, setResults] = useState<Item[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const totals = useMemo(() => {
    const done = results.filter((r) => r.status === "done");
    const original = done.reduce((a, r) => a + (r.originalSize || 0), 0);
    const compressed = done.reduce((a, r) => a + (r.compressedSize || 0), 0);
    const saved = Math.max(0, original - compressed);
    return { doneCount: done.length, original, compressed, saved };
  }, [results]);

  const pick = () => {
    if (limitReached) return;
    inputRef.current?.click();
  };

  const clearAll = () => {
    results.forEach((r) => {
      try {
        URL.revokeObjectURL(r.originalUrl);
        if (r.downloadUrl) URL.revokeObjectURL(r.downloadUrl);
      } catch {}
    });
    setResults([]);
    setLimitReached(false);
  };

  const triggerDownload = (url: string, filename: string, meta?: { action?: "compress" | "crop"; file?: string; fmt?: string }) => {
    // best-effort download tracking (only counts when signed in)
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "download", path: "/compress", action: meta?.action ?? "compress", file: meta?.file ?? filename, fmt: meta?.fmt ?? "" }),
      keepalive: true,
    }).catch(() => {});

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const compressOne = async (item: Item) => {
    const id = item.id;

    try {
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "uploading", stage: "analyzing" } : r))
      );

      const fd = new FormData();
      fd.set("file", item.file);
      fd.set("quality", String(quality));
      fd.set("format", format);
      fd.set("mode", mode);

      // Go straight to compressing (keep it snappy)
      setResults((prev) => prev.map((r) => (r.id === id ? { ...r, stage: "compressing" } : r)));

      const res = await fetch("/api/compress", { method: "POST", body: fd });

      if (!res.ok) {
        const text = await res.text().catch(() => "");

        if (isLimitReachedError(res.status, text)) {
          setLimitReached(true);
          setResults((prev) =>
            prev.map((r) =>
              r.id === id
                ? { ...r, status: "error", errorMsg: t("limit_reached_desc") }
                : r.status === "uploading"
                ? { ...r, status: "error", errorMsg: t("limit_reached_desc") }
                : r
            )
          );
          return;
        }

        if (res.status === 413) throw new Error(t("err_too_large"));
        throw new Error(text ? text.slice(0, 180) : `${t("err_generic")} (${res.status})`);
      }

      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, stage: "finalizing" } : r))
      );

      const blob = await res.blob();

      const outputFormat = res.headers.get("X-Output-Format") ?? undefined;
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const outputFileName = match?.[1] ?? undefined;

      // usage increment
      const usageRes = await fetch("/api/usage/increment", { method: "POST" });
      if (!usageRes.ok) {
        const txt = await usageRes.text().catch(() => "");
        if (isLimitReachedError(usageRes.status, txt)) setLimitReached(true);
      }

      const compressedSize = blob.size;
      const savings = Math.max(0, Math.min(100, Math.round(((item.file.size - compressedSize) / item.file.size) * 100)));
      const url = URL.createObjectURL(blob);

      setResults((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "done",
                stage: undefined,
                compressedSize,
                savings,
                downloadUrl: url,
                outputFormat,
                outputFileName,
              }
            : r
        )
      );
    } catch (e: any) {
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "error", stage: undefined, errorMsg: e?.message ?? t("err_generic") } : r))
      );
    }
  };

  const runWithConcurrency = async (items: Item[], concurrency = 3) => {
    let index = 0;
    const workers = new Array(concurrency).fill(0).map(async () => {
      while (index < items.length) {
        const current = items[index++];
        if (limitReached) return;
        await compressOne(current);
      }
    });
    await Promise.all(workers);
  };

  const onFiles = async (files: FileList | null) => {
    if (limitReached) return;
    if (!files || files.length === 0) return;

    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;

    const items: Item[] = list.map((f) => ({
      id: crypto.randomUUID(),
      name: safeFileName(f.name),
      file: f,
      originalSize: f.size,
      originalUrl: URL.createObjectURL(f),
      status: "idle",
    }));

    // prepend newest
    setOpenCompareId(null);
    setResults((prev) => [...items, ...prev]);
    setIsProcessing(true);

    await runWithConcurrency(items, 3);

    setIsProcessing(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    await onFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!limitReached) setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const downloadAll = () => {
    results
      .filter((r) => r.status === "done" && r.downloadUrl)
      .forEach((r) =>
        triggerDownload(r.downloadUrl!, r.outputFileName ?? `zippixel-${r.name}`, {
          action: "compress",
          file: r.name,
          fmt: r.outputFormat,
        })
      );
  };

  const stageLabel = (s?: Item["stage"]) => {
    if (s === "analyzing") return "Analyzing image…";
    if (s === "compressing") return "Optimizing & compressing…";
    if (s === "finalizing") return "Finalizing output…";
    return t("working");
  };

  return (
    <div
      className="relative"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      {/* Controls */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{t("quality")}</div>
            <div className="mt-2 flex items-center gap-3">
              <Slider value={[quality]} min={40} max={95} step={1} onValueChange={(v) => setQuality(v[0] ?? 80)} />
              <Badge variant="secondary" className="min-w-12 justify-center">{quality}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{t("output_format")}</div>
            <div className="mt-2">
              <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={t("auto_best")} />
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
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{t("mode")}</div>
            <div className="mt-2">
              <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">{t("mode_fast")}</SelectItem>
                  <SelectItem value="balanced">{t("mode_balanced")}</SelectItem>
                  <SelectItem value="ultra">{t("mode_ultra")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drop zone */}
      <button
        type="button"
        onClick={pick}
        disabled={limitReached}
        className={[
          "mt-4 w-full rounded-2xl border border-dashed border-border/60 bg-card/30 p-8 text-center transition-all",
          "hover:bg-card/50 hover:border-border",
          isDragging ? "ring-2 ring-primary/40 bg-card/60" : "",
          limitReached ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div className="mt-4 text-lg font-semibold">{t("upload_drop")}</div>
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">{t("upload_browse")}</span> {t("upload_supports")}
          </div>

          {limitReached ? (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm">
              <div className="font-semibold flex items-center gap-2">
                <Sparkles className="size-4" />
                {t("limit_reached_title")}
              </div>
              <div className="mt-1 text-muted-foreground">{t("limit_reached_desc")}</div>
            </div>
          ) : null}
        </div>
      </button>

      {/* Summary */}
      {totals.doneCount > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Compressed</div>
              <div className="mt-1 text-lg font-semibold">{totals.doneCount} files</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Total saved</div>
              <div className="mt-1 text-lg font-semibold">{formatBytes(totals.saved)}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Actions</div>
                <div className="mt-1 text-sm text-muted-foreground">Download or clear results</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={downloadAll} disabled={results.every((r) => !r.downloadUrl)}>
                  <Download className="mr-2 size-4" />
                  {t("download_all")}
                </Button>
                <Button size="sm" variant="outline" onClick={clearAll}>{t("clear")}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Results */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">{t("results")}</div>
          {isProcessing ? (
            <Badge variant="secondary">Processing…</Badge>
          ) : null}
        </div>

        <div className="mt-3 grid gap-4">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-border/50 bg-card/30 p-8 text-center text-sm text-muted-foreground">
              {t("no_files")}
            </div>
          ) : (
            results.map((r) => (
              <Card key={r.id} className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground">
                        <ImageIcon className="size-5" />
                      </div>
                      <div>
                        <div className="font-medium leading-tight break-all">{r.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {t("original")}: {formatBytes(r.originalSize)}
                          {r.compressedSize != null ? (
                            <>
                              <span className="mx-2">•</span>
                              {t("compressed")}: {formatBytes(r.compressedSize)}
                              <span className="mx-2">•</span>
                              {t("savings")}: <span className="text-foreground/90">{r.savings}%</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {r.status === "uploading" ? (
                        <Badge variant="secondary">{stageLabel(r.stage)}</Badge>
                      ) : null}
                      {r.status === "done" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">{t("done")}</Badge>
                      ) : null}
                      {r.status === "error" ? (
                        <Badge className="bg-destructive/15 text-destructive border border-destructive/25">{r.errorMsg ?? "Error"}</Badge>
                      ) : null}

                      {r.status === "done" && r.downloadUrl ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            triggerDownload(r.downloadUrl!, r.outputFileName ?? `zippixel-${r.name}`, {
                              action: "compress",
                              file: r.name,
                              fmt: r.outputFormat,
                            })
                          }
                        >
                          <Download className="mr-2 size-4" />
                          {t("download")}
                        </Button>
                      ) : null}

                      {r.status === "done" && r.downloadUrl ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setOpenCompareId((cur) => (cur === r.id ? null : r.id))}
                        >
                          <Sparkles className="mr-2 size-4" />
                          {openCompareId === r.id ? t("hide_compare") : t("show_compare")}
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  {/* Premium compare */}
                  {r.status === "done" && r.downloadUrl && openCompareId === r.id ? (
                    <div className="mt-4">
                      <BeforeAfter original={r.originalUrl} compressed={r.downloadUrl} />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Drag overlay */}
      {isDragging && !limitReached ? (
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary/50 bg-primary/5" />
      ) : null}
    </div>
  );
}
