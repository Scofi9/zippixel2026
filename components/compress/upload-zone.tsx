"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

type Status = "compressing" | "done" | "error"

type Format = "auto" | "jpg" | "png" | "webp" | "avif"

interface ResultItem {
  id: string
  name: string
  originalSize: number
  compressedSize: number
  savings: number
  status: Status
  downloadUrl?: string
  errorMsg?: string
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "https://api.zippixel.xyz"

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function UploadZone() {
  const [results, setResults] = useState<ResultItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // UI’daki slider/dropdown ile uyumlu olsun diye basit state:
  const [quality, setQuality] = useState<number>(80)
  const [format, setFormat] = useState<Format>("auto")

  const doneItems = useMemo(
    () => results.filter((r) => r.status === "done" && r.downloadUrl),
    [results]
  )

  const compressFiles = useCallback(
    async (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith("image/"))
      if (imageFiles.length === 0) return

      setIsProcessing(true)

      const entries: ResultItem[] = imageFiles.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        name: file.name,
        originalSize: file.size,
        compressedSize: 0,
        savings: 0,
        status: "compressing",
      }))

      setResults((prev) => [...prev, ...entries])

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const entryId = entries[i].id

        try {
          const form = new FormData()
          form.append("image", file)
          // backend şu an kullanmasa da problem değil:
          form.append("quality", String(quality))
          form.append("format", format)

          const res = await fetch(`${API_BASE}/compress`, {
            method: "POST",
            body: form,
          })

          if (!res.ok) throw new Error(`API error: ${res.status}`)

          const blob = await res.blob()
          const compressedSize = blob.size
          const savings = Math.round(((file.size - compressedSize) / file.size) * 100)
          const downloadUrl = URL.createObjectURL(blob)

          setResults((prev) =>
            prev.map((r) =>
              r.id === entryId
                ? {
                    ...r,
                    compressedSize,
                    savings: isFinite(savings) ? Math.max(0, savings) : 0,
                    status: "done",
                    downloadUrl,
                  }
                : r
            )
          )
        } catch (e: any) {
          setResults((prev) =>
            prev.map((r) =>
              r.id === entryId
                ? { ...r, status: "error", errorMsg: e?.message || "Failed" }
                : r
            )
          )
        }
      }

      setIsProcessing(false)
    },
    [quality, format]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files || [])
      if (files.length > 0) compressFiles(files)
    },
    [compressFiles]
  )

  const handleBrowse = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) compressFiles(files)
      e.target.value = ""
    },
    [compressFiles]
  )

  const handleDownloadAll = useCallback(() => {
    // Bazı tarayıcılar çoklu indirmeyi engelleyebilir.
    // O olursa tek tek “Download” ile indir.
    doneItems.forEach((r) => {
      if (r.downloadUrl) triggerDownload(r.downloadUrl, `compressed-${r.name}`)
    })
  }, [doneItems])

  const clearAll = useCallback(() => {
    // objectURL temizliği
    results.forEach((r) => {
      if (r.downloadUrl) URL.revokeObjectURL(r.downloadUrl)
    })
    setResults([])
  }, [results])

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={`rounded-2xl border border-dashed p-10 text-center transition ${
          isDragging ? "border-emerald-400/70" : "border-emerald-400/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10">
          <span className="text-xl">⬆</span>
        </div>

        <div className="text-sm font-medium">Drop images here to compress</div>
        <div className="mt-1 text-xs opacity-70">
          or click to browse. Supports JPG, PNG, WebP, AVIF.
        </div>

        <label className="mt-5 inline-block">
          <input
            className="hidden"
            type="file"
            accept="image/*"
            multiple
            onChange={handleBrowse}
          />
          <Button type="button" variant="secondary">
            Browse Files
          </Button>
        </label>
      </div>

      {/* Controls (basit) */}
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
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 text-xs opacity-70">
            Lower quality = smaller file size. 80% recommended.
          </div>
        </div>

        <div className="rounded-2xl border p-5">
          <div className="mb-2 text-sm font-medium">Output Format</div>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="w-full rounded-xl border bg-transparent p-2 text-sm"
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

      {/* Results */}
      <div className="rounded-2xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">Results ({results.length} images)</div>

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={clearAll}
              disabled={isProcessing || results.length === 0}
            >
              Clear
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleDownloadAll}
              disabled={isProcessing || doneItems.length === 0}
            >
              Download All
            </Button>
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
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="py-3 max-w-[320px] truncate">{r.name}</td>
                  <td className="py-3">{(r.originalSize / 1024).toFixed(1)} KB</td>
                  <td className="py-3">
                    {r.compressedSize ? (r.compressedSize / 1024).toFixed(1) : "-"} KB
                  </td>
                  <td className="py-3">
                    {r.status === "done" ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">
                        -{r.savings}%
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3">
                    {r.status === "compressing" && <span>⏳</span>}
                    {r.status === "done" && <span>✅</span>}
                    {r.status === "error" && <span title={r.errorMsg}>❌</span>}
                  </td>
                  <td className="py-3 text-right">
                    {r.status === "done" && r.downloadUrl ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => triggerDownload(r.downloadUrl!, `compressed-${r.name}`)}
                      >
                        Download
                      </Button>
                    ) : null}
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

        {isProcessing && (
          <div className="mt-3 text-xs opacity-70">Compressing…</div>
        )}
      </div>
    </div>
  )
}