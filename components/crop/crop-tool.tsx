"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, Download, RotateCcw } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";

type ExportFormat = "original" | "jpg" | "png" | "webp" | "avif";
type AspectKey = "free" | "1:1" | "16:9" | "4:3" | "3:2";

const ASPECTS: Record<Exclude<AspectKey, "free">, number> = {
  "1:1": 1,
  "16:9": 16 / 9,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
};

type Rect = { x: number; y: number; w: number; h: number };
type DragMode =
  | { kind: "move"; startX: number; startY: number; startRect: Rect }
  | { kind: "resize"; handle: string; startX: number; startY: number; startRect: Rect }
  | null;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeFileName(name: string) {
  return name.replace(/[^\w.\-() ]+/g, "_");
}

export function CropTool() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // image geometry
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [containerW, setContainerW] = useState<number>(0);
  const containerH = 420;

  // crop rectangle in *container* coordinates
  const [rect, setRect] = useState<Rect | null>(null);
  const dragRef = useRef<DragMode>(null);

  // controls
  const [aspectKey, setAspectKey] = useState<AspectKey>("free");
  const [format, setFormat] = useState<ExportFormat>("webp");
  const [quality, setQuality] = useState(90);

  const pick = () => inputRef.current?.click();

  const resetAll = () => {
    dragRef.current = null;
    setAspectKey("free");
    setFormat("webp");
    setQuality(90);
    setErrorMsg(null);
    if (resultUrl) {
      try {
        URL.revokeObjectURL(resultUrl);
      } catch {}
    }
    setResultUrl(null);
    setResultName(null);
    // rect will be re-initialized on image load/measure
  };

  const setNewFile = (f: File | null) => {
    resetAll();
    if (previewUrl) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
    }
    setNatural(null);
    setRect(null);
    if (!f) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const onFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = Array.from(files).find((x) => x.type.startsWith("image/")) ?? null;
    setNewFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFiles(e.dataTransfer.files);
  };

  // container width tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setContainerW(el.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewUrl]);

  // compute displayed image box (object-contain)
  const display = useMemo(() => {
    if (!natural || !containerW) return null;
    const scale = Math.min(containerW / natural.w, containerH / natural.h);
    const w = natural.w * scale;
    const h = natural.h * scale;
    const ox = (containerW - w) / 2;
    const oy = (containerH - h) / 2;
    return { scale, w, h, ox, oy };
  }, [natural, containerW]);

  // initialize crop rect
  useEffect(() => {
    if (!display) return;
    if (rect) return;

    const pad = 0.10;
    const w = display.w * (1 - pad * 2);
    const h = display.h * (1 - pad * 2);
    const x = display.ox + display.w * pad;
    const y = display.oy + display.h * pad;
    setRect({ x, y, w, h });
  }, [display, rect]);

  const aspect = aspectKey === "free" ? null : ASPECTS[aspectKey];

  const clampRectToImage = (r: Rect): Rect => {
    if (!display) return r;
    const minSize = 24;
    const x1 = display.ox;
    const y1 = display.oy;
    const x2 = display.ox + display.w;
    const y2 = display.oy + display.h;

    let w = Math.max(minSize, Math.min(r.w, x2 - x1));
    let h = Math.max(minSize, Math.min(r.h, y2 - y1));
    let x = clamp(r.x, x1, x2 - w);
    let y = clamp(r.y, y1, y2 - h);
    return { x, y, w, h };
  };

  const setRectWithAspect = (r: Rect, handle?: string): Rect => {
    if (!aspect || !display) return clampRectToImage(r);

    // keep aspect ratio by adjusting dependent dimension
    let next = { ...r };
    const target = aspect;
    if (handle && (handle.includes("e") || handle.includes("w"))) {
      next.h = next.w / target;
    } else {
      next.w = next.h * target;
    }
    return clampRectToImage(next);
  };

  const onPointerDownMove = (e: React.PointerEvent) => {
    if (!rect) return;
    e.preventDefault();
    try {
      containerRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    dragRef.current = { kind: "move", startX: e.clientX, startY: e.clientY, startRect: rect };
  };

  const onPointerDownHandle = (handle: string) => (e: React.PointerEvent) => {
    if (!rect) return;
    e.stopPropagation();
    e.preventDefault();
    try {
      containerRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    dragRef.current = { kind: "resize", handle, startX: e.clientX, startY: e.clientY, startRect: rect };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !rect) return;
    if (!display) return;

    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;

    if (d.kind === "move") {
      const next = clampRectToImage({
        x: d.startRect.x + dx,
        y: d.startRect.y + dy,
        w: d.startRect.w,
        h: d.startRect.h,
      });
      setRect(next);
      return;
    }

    const s = d.startRect;
    const minSize = 24;
    let x = s.x;
    let y = s.y;
    let w = s.w;
    let h = s.h;

    const hnd = d.handle;
    const east = hnd.includes("e");
    const west = hnd.includes("w");
    const north = hnd.includes("n");
    const south = hnd.includes("s");

    if (east) w = Math.max(minSize, s.w + dx);
    if (south) h = Math.max(minSize, s.h + dy);
    if (west) {
      w = Math.max(minSize, s.w - dx);
      x = s.x + (s.w - w);
    }
    if (north) {
      h = Math.max(minSize, s.h - dy);
      y = s.y + (s.h - h);
    }

    let next = { x, y, w, h };
    next = setRectWithAspect(next, hnd);
    setRect(next);
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  // precision values in NATURAL pixels
  const precision = useMemo(() => {
    if (!rect || !display) return { x: 0, y: 0, w: 0, h: 0 };
    const x = Math.round((rect.x - display.ox) / display.scale);
    const y = Math.round((rect.y - display.oy) / display.scale);
    const w = Math.round(rect.w / display.scale);
    const h = Math.round(rect.h / display.scale);
    return { x: Math.max(0, x), y: Math.max(0, y), w: Math.max(1, w), h: Math.max(1, h) };
  }, [rect, display]);

  const setPrecision = (next: Partial<typeof precision>) => {
    if (!rect || !display) return;
    const x = Number.isFinite(next.x as any) ? Number(next.x) : precision.x;
    const y = Number.isFinite(next.y as any) ? Number(next.y) : precision.y;
    const w = Number.isFinite(next.w as any) ? Number(next.w) : precision.w;
    const h = Number.isFinite(next.h as any) ? Number(next.h) : precision.h;

    let r: Rect = {
      x: display.ox + x * display.scale,
      y: display.oy + y * display.scale,
      w: Math.max(1, w) * display.scale,
      h: Math.max(1, h) * display.scale,
    };
    r = setRectWithAspect(r);
    setRect(r);
  };

  const cropAndDownload = async () => {
    if (!file || !display || !rect) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("x", String(precision.x));
      fd.set("y", String(precision.y));
      fd.set("width", String(precision.w));
      fd.set("height", String(precision.h));
      fd.set("rotation", "0");
      fd.set("format", format);
      fd.set("quality", String(quality));

      const res = await fetch("/api/crop", { method: "POST", body: fd });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        if (res.status === 403 && txt.includes("LIMIT_REACHED")) {
          throw new Error(t("limit_reached_desc"));
        }
        if (res.status === 413) throw new Error(t("err_too_large"));
        throw new Error(txt ? txt.slice(0, 200) : `Crop failed (${res.status})`);
      }

      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") ?? "";
      const match = cd.match(/filename="([^"]+)"/);
      const outName = match?.[1] ?? `zippixel-crop-${safeFileName(file.name)}`;

      // best-effort download tracking (counts only if signed in)
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "download", path: "/crop", action: "crop", file: file.name, fmt: format }),
        keepalive: true,
      }).catch(() => {});

      await fetch("/api/usage/increment", { method: "POST" }).catch(() => {});

      if (resultUrl) {
        try {
          URL.revokeObjectURL(resultUrl);
        } catch {}
      }
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setResultName(outName);

      const a = document.createElement("a");
      a.href = url;
      a.download = outName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e: any) {
      setErrorMsg(e?.message ?? "Crop failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />

      <Card className="relative overflow-hidden border-border/50 bg-card/50">
        <CardContent className="p-0">
          {!previewUrl ? (
            <button
              type="button"
              onClick={pick}
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="grid min-h-[420px] w-full place-items-center border border-dashed border-border/60 bg-gradient-to-b from-background/40 to-background/10 p-10 text-center transition-all hover:border-border hover:bg-accent/20"
            >
              <div className="max-w-md">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                  <UploadCloud className="size-6" />
                </div>
                <div className="mt-5 text-lg font-semibold">{t("crop_upload_title")}</div>
                <div className="mt-2 text-sm text-muted-foreground">{t("crop_upload_desc")}</div>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-4 py-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">{t("upload_browse")}</span>
                  <span>JPG, PNG, WebP, AVIF</span>
                </div>
              </div>
            </button>
          ) : (
            <div
              ref={containerRef}
              className="relative h-[420px] w-full bg-muted"
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <img
                ref={imgRef}
                src={previewUrl}
                alt="preview"
                className="absolute inset-0 h-full w-full select-none object-contain"
                draggable={false}
                onLoad={(e) => {
                  const el = e.currentTarget;
                  setNatural({ w: el.naturalWidth, h: el.naturalHeight });
                  // Reset rect to re-init with new natural dims
                  setRect(null);
                }}
              />

              {/* dim outside crop */}
              {rect ? (
                <>
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-0 top-0 w-full bg-black/35" style={{ height: rect.y }} />
                    <div className="absolute left-0 w-full bg-black/35" style={{ top: rect.y + rect.h, bottom: 0 }} />
                    <div className="absolute bg-black/35" style={{ left: 0, top: rect.y, width: rect.x, height: rect.h }} />
                    <div
                      className="absolute bg-black/35"
                      style={{ left: rect.x + rect.w, right: 0, top: rect.y, height: rect.h }}
                    />
                  </div>

                  {/* crop frame */}
                  <div
                    className="absolute rounded-xl border-2 border-white/85 shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                    style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h }}
                    onPointerDown={onPointerDownMove}
                  >
                    {/* handles */}
                    {(
                      [
                        { k: "nw", x: 0, y: 0 },
                        { k: "n", x: 50, y: 0 },
                        { k: "ne", x: 100, y: 0 },
                        { k: "w", x: 0, y: 50 },
                        { k: "e", x: 100, y: 50 },
                        { k: "sw", x: 0, y: 100 },
                        { k: "s", x: 50, y: 100 },
                        { k: "se", x: 100, y: 100 },
                      ] as const
                    ).map((h) => (
                      <div
                        key={h.k}
                        className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-white shadow"
                        style={{ left: `${h.x}%`, top: `${h.y}%` }}
                        onPointerDown={onPointerDownHandle(h.k)}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{t("crop_export")}</div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {file ? safeFileName(file.name) : "—"}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground">{t("crop_aspect")}</div>
                <Select value={aspectKey} onValueChange={(v) => setAspectKey(v as AspectKey)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">{t("crop_free")}</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                    <SelectItem value="4:3">4:3</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <div className="text-xs text-muted-foreground">{t("output_format")}</div>
                <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{t("crop_quality")}</div>
                  <Badge variant="secondary" className="min-w-12 justify-center">
                    {quality}
                  </Badge>
                </div>
                <Slider value={[quality]} min={40} max={95} step={1} onValueChange={(v) => setQuality(v[0] ?? 90)} />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="grid gap-1.5">
                  <div className="text-xs text-muted-foreground">{t("crop_x")}</div>
                  <Input value={String(precision.x)} inputMode="numeric" onChange={(e) => setPrecision({ x: Number(e.target.value) })} />
                </div>
                <div className="grid gap-1.5">
                  <div className="text-xs text-muted-foreground">{t("crop_y")}</div>
                  <Input value={String(precision.y)} inputMode="numeric" onChange={(e) => setPrecision({ y: Number(e.target.value) })} />
                </div>
                <div className="grid gap-1.5">
                  <div className="text-xs text-muted-foreground">{t("crop_w")}</div>
                  <Input value={String(precision.w)} inputMode="numeric" onChange={(e) => setPrecision({ w: Number(e.target.value) })} />
                </div>
                <div className="grid gap-1.5">
                  <div className="text-xs text-muted-foreground">{t("crop_h")}</div>
                  <Input value={String(precision.h)} inputMode="numeric" onChange={(e) => setPrecision({ h: Number(e.target.value) })} />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{t("crop_tip")}</p>

              {errorMsg ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMsg}
                </div>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button className="h-11 rounded-xl" onClick={cropAndDownload} disabled={!file || !rect || isProcessing}>
                  <Download className="mr-2 size-4" />
                  {isProcessing ? t("working") : t("crop_apply")}
                </Button>

                <Button className="h-11 rounded-xl" variant="outline" onClick={resetAll} disabled={!file || isProcessing}>
                  <RotateCcw className="mr-2 size-4" />
                  {t("crop_reset")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {resultUrl ? (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Result</div>
                <Button size="sm" asChild variant="secondary">
                  <a href={resultUrl} download={resultName ?? undefined}>
                    <Download className="mr-2 size-4" />
                    Download
                  </a>
                </Button>
              </div>
              <div className="mt-3 overflow-hidden rounded-xl border border-border/50 bg-muted">
                <img src={resultUrl} alt="result" className="h-44 w-full object-contain" />
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
