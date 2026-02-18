"use client"

import React, { useMemo, useRef, useState } from "react"

type OutputFormat = "auto" | "jpg" | "png" | "webp" | "avif"

type ResultItem = {
  id: string
  fileName: string
  originalBytes: number
  compressedBytes?: number
  savingsPct?: number
  status: "idle" | "uploading" | "done" | "error"
  error?: string
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "-"
  const units = ["B", "KB", "MB", "GB"]
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export default function UploadZone() {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [quality, setQuality] = useState(80)
  const [format, setFormat] = useState<OutputFormat>("auto")
  const [results, setResults] = useState<ResultItem[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const canClear = results.length > 0

  const onPickFiles = () => {
    inputRef.current?.click()
  }

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const picked = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (picked.length === 0) return

    // UI'ya ekle
    const items: ResultItem[] = picked.map((f) => ({
      id: crypto.randomUUID(),
      fileName: f.name,
      originalBytes: f.size,
      status: "uploading",
    }))

    setResults((prev) => [...items, ...prev])

    // Şimdilik sadece "upload geliyor mu" test ediyoruz:
    // API endpoint'in hazır değilse bile en azından request göreceğiz.
    for (let idx = 0; idx < picked.length; idx++) {
      const file = picked[idx]
      const id = items[idx].id

      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("quality", String(quality))
        formData.append("format", format)

        const res = await fetch("/api/compress", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(`API ${res.status}: ${text.slice(0, 200)}`)
        }

        // API binary döndüğünü varsayalım:
        const blob = await res.blob()
        const compressedBytes = blob.size
        const savingsPct = Math.max(
          0,
          Math.min(100, Math.round(((file.size - compressedBytes) / file.size) * 100))
        )

        setResults((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: "done", compressedBytes, savingsPct }
              : r
          )
        )
      } catch (e: any) {
        setResults((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: "error", error: e?.message ?? "Upload failed" }
              : r
          )
        )
      }
    }

    // Aynı dosyayı tekrar seçebilmek için input'u resetle
    if (inputRef.current) inputRef.current.value = ""
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    void onFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const clear = () => setResults([])

  return (
    <div className="space-y-6">
      <div
        className={[
          "rounded-2xl border border-dashed p-10 text-center transition",
          isDragging ? "border-emerald-400/80 bg-emerald-500/5" : "border-emerald-400/30",
        ].join(" ")}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10">
          <span className="text-xl">⬆</span>
        </div>

        <div className="text-sm font-medium">Drop images here to compress</div>
        <div className="mt-1 text-xs opacity-70">
          or click to browse. Supports JPG, PNG, WebP, AVIF.
        </div>

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
          onClick={onPickFiles}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
        >
          Browse Files
        </button>
      </div>

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
          <div className="mt-2 text-xs opacity-70">
            Lower quality = smaller file size. 80% recommended.
          </div>
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
          <div className="mt-2 text-xs opacity-70">
            Auto selects the best format for each image.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">Results ({results.length} images)</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clear}
              disabled={!canClear}
              className="inline-flex h-8 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground disabled:opacity-50"
            >
              Clear
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
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td className="py-6 text-center opacity-70" colSpan={5}>
                    No files yet.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.id} className="border-b last:border-b-0">
                    <td className="py-3">{r.fileName}</td>
                    <td className="py-3">{formatBytes(r.originalBytes)}</td>
                    <td className="py-3">
                      {r.compressedBytes != null ? formatBytes(r.compressedBytes) : "-"}
                    </td>
                    <td className="py-3">
                      {r.savingsPct != null ? `${r.savingsPct}%` : "-"}
                    </td>
                    <td className="py-3">
                      {r.status === "uploading" && "Uploading..."}
                      {r.status === "done" && "Done"}
                      {r.status === "error" && (
                        <span className="text-red-400">{r.error ?? "Error"}</span>
                      )}
                      {r.status === "idle" && "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs opacity-70">
          Not working? If you see “API 404”, it means <code>/api/compress</code> route isn’t created yet.
        </p>
      </div>
    </div>
  )
}