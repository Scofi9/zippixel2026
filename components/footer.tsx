import Link from "next/link"
import { Logo } from "@/components/logo"

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Compress Images", href: "/compress" },
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
      { label: "Pricing", href: "/pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Reduce Image Size", href: "/compress" },
      { label: "Image Compressor", href: "/compress" },
      { label: "API Docs", href: "/docs" },
      { label: "Tools", href: "/tools" },
      { label: "Support", href: "/docs" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              AI-powered image compression that reduces file size up to 90%
              without losing visual quality.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZipPixel. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
