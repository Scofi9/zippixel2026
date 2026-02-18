import type { Metadata } from "next"
import { FileImage, Download, Trash2, FolderOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = { title: "Files" }

const files = [
  { name: "hero-banner.webp", size: "680 KB", format: "WebP", date: "Feb 18" },
  { name: "product-photo-01.png", size: "890 KB", format: "PNG", date: "Feb 18" },
  { name: "team-photo.webp", size: "420 KB", format: "WebP", date: "Feb 17" },
  { name: "bg-pattern.avif", size: "180 KB", format: "AVIF", date: "Feb 17" },
  { name: "screenshot.jpg", size: "920 KB", format: "JPG", date: "Feb 16" },
  { name: "icon-set.avif", size: "120 KB", format: "AVIF", date: "Feb 16" },
]

export default function FilesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Files</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your compressed image files.
        </p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Storage</CardTitle>
          <CardDescription>1.8 GB of 5.0 GB used</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={36} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <Card key={file.name} className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileImage className="size-5 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs">{file.format}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground truncate">{file.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{file.size} &middot; {file.date}</p>
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="mr-1 size-3.5" />
                  Download
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {files.length === 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="size-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">No files yet. Compress images to see them here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
