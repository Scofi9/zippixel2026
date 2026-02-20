"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

export default function UploadZone() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("auto");
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
      triggerDownload(r.downloadUrl!, `compressed-${safeFileName(r.name)}`)
    );
  };

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

        throw new Error(
          text ? text.slice(0, 200) : `Request failed (${res.status})`
        );
      }

      const blob = await res.blob();

      // Başarılı compress sonrası usage artır
      await fetch("/api/usage/increment", { method: "POST" });

      const compressedSize = blob.size;
      const savings = Math.max(
        0,
        Math.min(100, Math.round(((file.size - compressedSize) / file.size) * 100))
      );

      const url = URL.createObjectURL(blob);

      setResults((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "done", compressedSize, savings, downloadUrl: url }
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
          {limitReached ? "Upgrade required" : "Drop images here to compress"}
        </div>

        <div className="mt-1 text-sm text-muted-foreground">
          {limitReached
            ? "You’ve hit your monthly limit."
            : "or click to browse. Supports JPG, PNG, WebP, AVIF."}
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
          Browse Files
        </button>
      </div>

      {/* Controls */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background/40 p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Quality</div>
            <div className="text-sm font-semibold">{quality}%</div>
          </div>
          <input
            type="range"
            min={10}
            max={95}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="mt-3 w-full"
            disabled={limitReached}
          />
          <div className="mt-2 text-xs text-muted-foreground">
            Lower quality = smaller file size. 80% recommended.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background/40 p-5">
          <div className="text-sm font-medium">Output Format</div>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            disabled={limitReached}
          >
            <option value="auto">Auto (Best format)</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
          <div className="mt-2 text-xs text-muted-foreground">
            Auto selects a reasonable output format.
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-semibold">
            Results ({results.length} images)
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={downloadAll}
              disabled={doneCount === 0}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Download All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 pr-4">File</th>
                <th className="py-2 pr-4">Original</th>
                <th className="py-2 pr-4">Compressed</th>
                <th className="py-2 pr-4">Savings</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Download</th>
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
                    {r.status === "done" ? `-${r.savings}%` : "-"}
                  </td>
                  <td className="py-3 pr-4">
                    {r.status === "uploading" && "Working"}
                    {r.status === "done" && "Done"}
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
                            `compressed-${safeFileName(r.name)}`
                          )
                        }
                      >
                        Download
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
                    No files yet.
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