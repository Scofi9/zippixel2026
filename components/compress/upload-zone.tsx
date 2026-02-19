"use client";

import React, { useRef, useState } from "react";

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

export default function UploadZone() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("auto");
  const [results, setResults] = useState<Item[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pick = () => inputRef.current?.click();

  const clearAll = () => {
    // objectURL cleanup
    results.forEach((r) => {
      if (r.downloadUrl) URL.revokeObjectURL(r.downloadUrl);
    });
    setResults([]);
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
    done.forEach((r) => triggerDownload(r.downloadUrl!, `compressed-${safeFileName(r.name)}`));
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
        throw new Error(`API ${res.status}: ${text.slice(0, 300)}`);
      }

      const blob = await res.blob();
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
    } catch (e: any) {
      setResults((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "error", errorMsg: e?.message ?? "Compression failed" } : r
        )
      );
    }
  };

  const onFiles = async (files: FileList | null) => {
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

    // sırayla compress (istersen sonra paralel yaparız)
    for (let i = 0; i < list.length; i++) {
      await compressOne(list[i], items[i].id);
    }

    setIsProcessing(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    void onFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={[
          "rounded-2xl border border-dashed p-10 text-center transition cursor-pointer",
          isDragging ? "border-emerald-400/80 bg-emerald-500/5" : "border-emerald-400/30",
        ].join(" ")}
        onClick={pick}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10">
          <span className="text-xl">↑</span>
        </div>

        <div className="text-sm font-medium">Drop images here to compress</div>
        <div className="mt-1 text-xs opacity-70">or click to browse. Supports JPG, PNG, WebP, AVIF.</div>

        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => void onFiles(e.target.files)}
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            pick();
          }}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Browse Files
        </button>
      </div>

      {/* Controls */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-5">
          <div className="mb-2 flex items-center justify-between text-sm font-medium">
            <span>Quality</span>
            <span className="text-emerald-400">{quality}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            className="w-full"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
          <div className="mt-2 text-xs opacity-70">Lower quality = smaller file size. 80% recommended.</div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="mb-2 text-sm font-medium">Output Format</div>
          <select
            className="w-full rounded-xl border bg-transparent p-2 text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
          >
            <option value="auto">Auto (Best format)</option>
            <option value="jpg">JPG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
            <option value="avif">AVIF</option>
          </select>
          <div className="mt-2 text-xs opacity-70">Auto selects a reasonable output format.</div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-2xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">Results ({results.length} images)</div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
              onClick={clearAll}
              disabled={isProcessing || results.length === 0}
            >
              Clear
            </button>

            <button
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              onClick={downloadAll}
              disabled={isProcessing || results.filter((r) => r.status === "done" && r.downloadUrl).length === 0}
            >
              Download All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr className="opacity-70">
                <th className="py-2">File</th>
                <th className="py-2">Original</th>
                <th className="py-2">Compressed</th>
                <th className="py-2">Savings</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Download</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="py-3 max-w-[320px] truncate">{r.name}</td>
                  <td className="py-3">{bytesToKB(r.originalSize)} KB</td>
                  <td className="py-3">{r.compressedSize ? `${bytesToKB(r.compressedSize)} KB` : "-"}</td>
                  <td className="py-3">{r.status === "done" ? `-${r.savings}%` : "-"}</td>
                  <td className="py-3">
                    {r.status === "uploading" && "Working"}
                    {r.status === "done" && "Done"}
                    {r.status === "error" && `Error: ${r.errorMsg ?? "Compression failed"}`}
                  </td>
                  <td className="py-3 text-right">
                    {r.status === "done" && r.downloadUrl ? (
                      <button
                        type="button"
                        className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
                        onClick={() => triggerDownload(r.downloadUrl!, `compressed-${safeFileName(r.name)}`)}
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
                  <td className="py-6 text-center opacity-70" colSpan={6}>
                    No files yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isProcessing && <div className="mt-3 text-xs opacity-70">Compressing…</div>}
      </div>
    </div>
  );
}