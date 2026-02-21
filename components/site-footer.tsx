import Link from "next/link";
import { SupportWidget } from "@/components/support-widget";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/40 bg-background/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          <div className="font-medium text-foreground">ZipPixel</div>
          <div className="mt-1">AI‑powered image compression for modern workflows.</div>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/docs" className="hover:text-foreground">Docs</Link>
            <Link href="/compress" className="hover:text-foreground">Compress</Link>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ZipPixel
          </div>
          <SupportWidget />
        </div>
      </div>
    </footer>
  );
}
