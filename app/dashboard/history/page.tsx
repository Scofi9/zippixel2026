import type { Metadata } from "next";
import Link from "next/link";
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
  const b = Number(bytes || 0);
  if (!b) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(b) / Math.log(1024)), sizes.length - 1);
  return (b / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

function formatDate(ts: number) {
  const n = Number(ts);
  if (!n) return "-";
  try {
    return new Date(n).toLocaleString();
  } catch {
    return "-";
  }
}

function formatSavingsPercent(value: any) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  // normalde savings 24 ise "-24%" gösterir, eğer data zaten -24 gelirse "-24%" olarak kalsın
  return n >= 0 ? `-${n}%` : `${n}%`;
}

type JobItem = {
  id?: string;
  fileName?: string;
  outputFormat?: string;
  originalBytes?: number;
  compressedBytes?: number;
  savingsPercent?: number;
  createdAt?: number;
};

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

  let jobs: JobItem[] = [];
  try {
    const redis = getRedis();
    const raw = await redis.lrange(`jobs:${userId}`, 0, 100);

    jobs = raw
      .map((j: any) => (typeof j === "string" ? JSON.parse(j) : j))
      .filter(Boolean);
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
                {jobs.map((item, i) => {
                  const id = item.id;
                  const canDownload = Boolean(id);

                  return (
                    <TableRow key={id ?? i}>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-0">
                          <FileImage className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-sm font-medium truncate">
                            {item.fileName || "untitled"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {(item.outputFormat || "WEBP").toString().toUpperCase()}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs">
                        {formatBytes(item.originalBytes || 0)}
                      </TableCell>

                      <TableCell className="text-right font-mono text-xs">
                        {formatBytes(item.compressedBytes || 0)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {formatSavingsPercent(item.savingsPercent)}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">
                        {formatDate(item.createdAt || 0)}
                      </TableCell>

                      <TableCell className="text-right">
                        {canDownload ? (
                          <Button variant="ghost" size="icon-sm" title="Download" asChild>
                            <Link href={`/api/download?id=${encodeURIComponent(id!)}`} prefetch={false}>
                              <Download className="size-3.5" />
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="icon-sm" disabled title="No id for download">
                            <Download className="size-3.5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}