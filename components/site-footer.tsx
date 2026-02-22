import Link from "next/link";
import { Logo } from "@/components/logo";
import { SupportWidget } from "@/components/support-widget";

const sections = [
  {
    title: "Product",
    links: [
      { label: "Compress Images", href: "/compress" },
      { label: "Crop Images", href: "/crop" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Tools Index", href: "/tools" },
      { label: "Compress JPG", href: "/compress/jpg" },
      { label: "Compress PNG", href: "/compress/png" },
      { label: "WebP Converter", href: "/compress/webp" },
      { label: "AVIF Converter", href: "/compress/avif" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Features", href: "/features" },
      { label: "Docs", href: "/docs" },
      { label: "Status", href: "/status" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Compress and crop images with a premium-quality engine. Faster pages, smaller files, happier users.
            </p>

            <div className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-card/50 p-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              <div className="text-xs text-muted-foreground">
                Privacy-friendly analytics. No cookies. No tracking pixels.
              </div>
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ZipPixel. All rights reserved.</p>
          <div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
            <SupportWidget />
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
