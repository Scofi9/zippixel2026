import type { Metadata } from "next"
import { Download, FileImage } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata: Metadata = { title: "History" }

const history = [
  { file: "hero-banner.jpg", format: "JPG", original: "3.2 MB", compressed: "680 KB", savings: "79%", date: "Feb 18, 2026" },
  { file: "product-photo-01.png", format: "PNG", original: "5.1 MB", compressed: "890 KB", savings: "83%", date: "Feb 18, 2026" },
  { file: "team-photo.webp", format: "WebP", original: "2.8 MB", compressed: "420 KB", savings: "85%", date: "Feb 17, 2026" },
  { file: "bg-pattern.png", format: "PNG", original: "1.2 MB", compressed: "180 KB", savings: "85%", date: "Feb 17, 2026" },
  { file: "screenshot-dashboard.jpg", format: "JPG", original: "4.5 MB", compressed: "920 KB", savings: "80%", date: "Feb 16, 2026" },
  { file: "icon-set.avif", format: "AVIF", original: "800 KB", compressed: "120 KB", savings: "85%", date: "Feb 16, 2026" },
  { file: "marketing-banner.webp", format: "WebP", original: "6.2 MB", compressed: "1.1 MB", savings: "82%", date: "Feb 15, 2026" },
  { file: "avatar-grid.png", format: "PNG", original: "2.4 MB", compressed: "380 KB", savings: "84%", date: "Feb 14, 2026" },
]

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All your past compression jobs.
        </p>
      </div>
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Compression History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-right">Original</TableHead>
                <TableHead className="text-right">Compressed</TableHead>
                <TableHead className="text-right">Savings</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileImage className="size-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.file}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{item.format}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">{item.original}</TableCell>
                  <TableCell className="text-right font-mono text-xs">{item.compressed}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">-{item.savings}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">{item.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon-sm">
                      <Download className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
