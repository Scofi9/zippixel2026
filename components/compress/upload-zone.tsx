"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

type Status = "compressing" | "done" | "error"

interface CompressedImage {
  id: string
  name: string
  originalSize: number
  compressedSize: number
  savings: number
  status: Status
  downloadUrl?: string
  errorMsg?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.zippixel.xyz"

export default function UploadZone() {
  const [files, setFiles] = useState<CompressedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Projedeki UI ile uyum için aynı isimleri tuttum.
  // Eğer sende quality/format zaten farklı yönetiliyorsa sorun değil.
  const [quality, setQuality] = useState<[number]>([80])
  const [format, setFormat] = useState<string>("auto")

  const doneCount = useMemo(
    () => files.filter((f) => f.status === "done" && f.downloadUrl).length,
    [files]
  )

  const compressFiles = useCallback(
    async (fileList: File[]) => {
      setIsProcessing(true)

      const entries: CompressedImage[] = fileList.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        name: file.name,
        originalSize: file.size,
        compressedSize: 0,
        savings: 0,
        status: "compressing",
      }))

      setFiles((prev) => [...prev, ...entries])

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        const entryId = entries[i].id

        try {
          const form = new FormData()
          form.append("image", file)
          form.append("quality", String(quality[0]))
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

          setFiles((prev) =>
            prev.map((f) =>
              f.id === entryId
                ? {
                    ...f,
                    compressedSize,
                    savings: isFinite(savings) ? Math.max(0, savings) : 0,
                    status: "done",
                    downloadUrl,
                  }
                : f
            )
          )
        } catch (e: any) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entryId
                ? { ...f, status: "error", errorMsg: e?.message || "Failed" }
                : f
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

      const images = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      )

      if (images.length > 0) compressFiles(images)
    },
    [compressFiles]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (!selectedFiles) return

      const images = Array.from(selectedFiles).filter((f) =>
        f.type.startsWith("image/")
      )

      if (images.length > 0) compressFiles(images)
    },
    [compressFiles]
  )

  const downloadAll = useCallback(() => {
    const done = files.filter((f) => f.status === "done" && f.downloadUrl)
    done.forEach((f) => {
      const a = document.createElement("a")
      a.href = f.downloadUrl!
      a.download = `compressed-${f.name}`
      document.body.appendChild(a)
      a.click()
      a.remove()
    })
  }, [files])

  return (
    <div className="space-y-4">
      <div
        className={`rounded-xl border p-6 text-center ${
          isDragging ? "border-primary" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="mb-3 text-sm opacity-80">Drag & drop images here</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={downloadAll}
          disabled={isProcessing || doneCount === 0}
        >
          Download All
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setFiles([])}
          disabled={isProcessing || files.length === 0}
        >
          Clear
        </Button>
      </div>

      <div className="text-sm opacity-80">
        {files.length} file(s) • {doneCount} ready
      </div>

      <div className="space-y-2">
        {files.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <div className="min-w-0">
              <div className="truncate">{f.name}</div>
              <div className="opacity-70">
                {Math.round(f.originalSize / 1024)} KB →{" "}
                {f.compressedSize ? Math.round(f.compressedSize / 1024) : 0} KB{" "}
                {f.status === "done" ? `(${f.savings}%)` : ""}
                {f.status === "error" ? ` (${f.errorMsg})` : ""}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {f.status === "done" && f.downloadUrl && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const a = document.createElement("a")
                    a.href = f.downloadUrl!
                    a.download = `compressed-${f.name}`
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                  }}
                >
                  Download
                </Button>
              )}
              <div className="opacity-70">{f.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}