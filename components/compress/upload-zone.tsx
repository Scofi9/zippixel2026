"use client"

import { useState } from "react"

type Result = {
  name: string
  original: number
  compressed?: number
  url?: string
  status: string
}

export default function UploadZone() {
  const [results, setResults] = useState<Result[]>([])

  async function handleFiles(files: FileList | null) {
    if (!files) return

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      const newResult: Result = {
        name: file.name,
        original: file.size,
        status: "Uploading..."
      }

      setResults(prev => [...prev, newResult])

      try {
        const res = await fetch("/api/compress", {
          method: "POST",
          body: formData
        })

        const blob = await res.blob()

        if (!res.ok) {
          throw new Error("Compression failed")
        }

        const url = URL.createObjectURL(blob)

        setResults(prev =>
          prev.map(r =>
            r.name === file.name
              ? {
                  ...r,
                  compressed: blob.size,
                  url,
                  status: "Done"
                }
              : r
          )
        )
      } catch {
        setResults(prev =>
          prev.map(r =>
            r.name === file.name
              ? { ...r, status: "Error" }
              : r
          )
        )
      }
    }
  }

  return (
    <div className="space-y-4">

      <input
        type="file"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
      />

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>File</th>
            <th>Original</th>
            <th>Compressed</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{(r.original / 1024).toFixed(1)} KB</td>
              <td>
                {r.compressed
                  ? (r.compressed / 1024).toFixed(1) + " KB"
                  : "-"}
              </td>
              <td>{r.status}</td>

              <td>
                {r.url && (
                  <a
                    href={r.url}
                    download={`compressed-${r.name}`}
                    className="text-green-400 underline"
                  >
                    Download
                  </a>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  )
}