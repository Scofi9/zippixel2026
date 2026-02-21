import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | ZipPixel",
  description: "Browse ZipPixel image compression and optimization tools.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  { slug: "image-compressor", title: "Online Image Compressor" },
  { slug: "reduce-image-size", title: "Reduce Image File Size" },
  { slug: "compress-jpg", title: "Compress JPG" },
  { slug: "compress-png", title: "Compress PNG" },
  { slug: "compress-webp", title: "Compress WebP" },
  { slug: "compress-avif", title: "Compress AVIF" },
  { slug: "png-to-webp", title: "Convert PNG to WebP" },
  { slug: "jpg-to-webp", title: "Convert JPG to WebP" },
  { slug: "png-to-avif", title: "Convert PNG to AVIF" },
  { slug: "jpg-to-avif", title: "Convert JPG to AVIF" },
  { slug: "webp-to-jpg", title: "Convert WebP to JPG" },
  { slug: "webp-to-png", title: "Convert WebP to PNG" },
  { slug: "avif-to-jpg", title: "Convert AVIF to JPG" },
  { slug: "image-optimizer", title: "Image Optimizer" },
  { slug: "bulk-image-compressor", title: "Bulk Image Compressor" },
  { slug: "website-image-optimization", title: "Website Image Optimization" },
  { slug: "ecommerce-image-compressor", title: "E-commerce Image Compressor" },
  { slug: "social-media-image-compressor", title: "Social Media Image Compressor" },
  { slug: "free-image-compressor", title: "Free Image Compressor" },
  { slug: "online-webp-converter", title: "Online WebP Converter" },
];

export default function ToolsIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">ZipPixel</p>
        <h1 className="text-4xl font-semibold tracking-tight">Tools</h1>
        <p className="mt-2 text-muted-foreground">
          Fast, simple tools for image compression and optimization.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link
            key={t.slug}
            href={`/tools/${t.slug}`}
            className="rounded-2xl border bg-card p-5 hover:shadow-sm"
          >
            <div className="font-medium">{t.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Open tool page
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <Button asChild size="lg">
          <Link href="/compress">Open Compressor</Link>
        </Button>
      </div>
    </div>
  );
}
