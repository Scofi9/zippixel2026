"use client"

import { useState, useCallback } from "react"
import {
  Upload,
  ImageDown,
  Download,
  Trash2,
  FileImage,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CompressedImage {
  id: string
  name: string
  originalSize: number
  compressedSize: number
  savings: number
  status: "compressing" | "done" | "error"
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function UploadZone({ defaultFormat = "auto" }: { defaultFormat?: string }) {
  const [files, setFiles] = useState<CompressedImage[]>([])
  const [quality, setQuality] = useState([80])
  const [format, setFormat] = useState(defaultFormat)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const simulateCompression = useCallback(
    (fileNames: string[]) => {
      setIsProcessing(true)
      const newFiles: CompressedImage[] = fileNames.map((name, i) => ({
        id: `${Date.now()}-${i}`,
        name,
        originalSize: Math.floor(Math.random() * 4000000) + 500000,
        compressedSize: 0,
        savings: 0,
        status: "compressing" as const,
      }))

      setFiles((prev) => [...prev, ...newFiles])

      newFiles.forEach((file, index) => {
        setTimeout(() => {
          const ratio = (quality[0] / 100) * 0.4 + 0.1
          const compressedSize = Math.floor(file.originalSize * ratio)
          const savings = Math.round(
            ((file.originalSize - compressedSize) / file.originalSize) * 100
          )
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, compressedSize, savings, status: "done" as const }
                : f
            )
          )
          if (index === newFiles.length - 1) {
            setIsProcessing(false)
          }
        }, 1500 + index * 800)
      })
    },
    [quality]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
        .filter((f) => f.type.startsWith("image/"))
        .map((f) => f.name)
      if (droppedFiles.length > 0) {
        simulateCompression(droppedFiles)
      }
    },
    [simulateCompression]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles) {
        const names = Array.from(selectedFiles).map((f) => f.name)
        simulateCompression(names)
      }
    },
    [simulateCompression]
  )

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearAll = () => {
    setFiles([])
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-secondary/30"
        )}
      >
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <Upload className="size-7 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Drop images here to compress
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          or click to browse. Supports JPG, PNG, WebP, AVIF up to 50MB.
        </p>
        <label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <Button className="mt-6 cursor-pointer" variant="outline" asChild>
            <span>
              <ImageDown className="mr-2 size-4" />
              Browse Files
            </span>
          </Button>
        </label>
      </div>

      {/* Controls */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Quality
              </label>
              <span className="text-sm font-mono text-primary">{quality[0]}%</span>
            </div>
            <Slider
              value={quality}
              onValueChange={setQuality}
              max={100}
              min={10}
              step={5}
              className="mt-3"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Lower quality = smaller file size. 80% recommended.
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <label className="text-sm font-medium text-foreground">
              Output Format
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="mt-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Best format)</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="avif">AVIF</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-xs text-muted-foreground">
              Auto selects the best format for each image.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {files.length === 0 && !isProcessing ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileImage className="size-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              No images compressed yet. Upload files to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Results ({files.length} images)
              </h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={clearAll}>
                  <Trash2 className="mr-1 size-3.5" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  disabled={files.some((f) => f.status === "compressing")}
                >
                  <Download className="mr-1 size-3.5" />
                  Download All
                </Button>
              </div>
            </div>
            <div className="mt-4 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Original</TableHead>
                    <TableHead className="text-right">Compressed</TableHead>
                    <TableHead className="text-right">Savings</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileImage className="size-4 shrink-0 text-muted-foreground" />
                          <span className="max-w-[200px] truncate">
                            {file.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {formatBytes(file.originalSize)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {file.status === "compressing" ? (
                          <Skeleton className="ml-auto h-4 w-12" />
                        ) : (
                          formatBytes(file.compressedSize)
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {file.status === "compressing" ? (
                          <Skeleton className="ml-auto h-4 w-10" />
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary"
                          >
                            -{file.savings}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {file.status === "compressing" ? (
                          <Loader2 className="ml-auto size-4 animate-spin text-muted-foreground" />
                        ) : file.status === "done" ? (
                          <CheckCircle2 className="ml-auto size-4 text-primary" />
                        ) : (
                          <AlertCircle className="ml-auto size-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {isProcessing && (
              <div className="mt-4">
                <Progress value={65} className="h-1.5" />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Compressing images...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
