import type { Metadata } from "next";
import { Download, FileImage } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { getRedis } from "@/lib/redis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = { title: "History" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

function formatDate(ts: number) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return "-";
  }
}

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-2 text-sm text-muted-foreground">Login required.</p>
      </div>
    );
  }

  let jobs: any[] = [];
  try {
    const redis = getRedis();
    const raw = await redis.lrange(`jobs:${userId}`, 0, 100);
    jobs = raw.map((j: any) => (typeof j === "string" ? JSON.parse(j) : j));
  } catch (e: any) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-2 text-sm text-red-400">History error</p>
        <pre className="mt-3 text-xs opacity-80">{e?.message || String(e)}</pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="mt-1 text-sm text-muted-foreground">All your past compression jobs.</p>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Compression History</CardTitle>
        </CardHeader>

        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-sm text-muted-foreground">No compressions yet.</div>
          ) : (
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
                {jobs.map((item, i) => (
                  <TableRow key={item.id ?? i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileImage className="size-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{item.fileName}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {(item.outputFormat || "WEBP").toString().toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-mono text-xs">{formatBytes(item.originalBytes)}</TableCell>
                    <TableCell className="text-right font-mono text-xs">{formatBytes(item.compressedBytes)}</TableCell>

                    <TableCell className="text-right">
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        -{item.savingsPercent}%
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">
                      {formatDate(item.createdAt)}
                    </TableCell>

                    <TableCell>
                      {/* Download'ı sonra Blob'a bağlarız. Şimdilik disabled */}
                      <Button variant="ghost" size="icon-sm" disabled title="Download coming soon">
                        <Download className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}