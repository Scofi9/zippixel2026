import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

type Tool = { slug: string; title: string; desc: string };

const TOOLS: Tool[] = [
  { slug: "crop-image", title: "Crop Image Online", desc: "Crop images online in seconds. Reframe photos and export to JPG, PNG, WebP, or AVIF." },
  { slug: "image-cropper", title: "Online Image Cropper", desc: "A fast, simple image cropper for perfect framing and aspect ratios." },
  { slug: "crop-photo", title: "Crop Photo", desc: "Crop photos to the right size for social, web, and mobile." },

  { slug: "image-compressor", title: "Online Image Compressor", desc: "Compress images online in seconds. Reduce file size while keeping quality." },
  { slug: "reduce-image-size", title: "Reduce Image File Size", desc: "Make images smaller for web, email, and faster pages." },
  { slug: "compress-jpg", title: "Compress JPG", desc: "Shrink JPEG/JPG photos without visible quality loss." },
  { slug: "compress-png", title: "Compress PNG", desc: "Reduce PNG size while keeping transparency." },
  { slug: "compress-webp", title: "Compress WebP", desc: "Optimize WebP images for faster websites." },
  { slug: "compress-avif", title: "Compress AVIF", desc: "Optimize AVIF images for best compression." },

  { slug: "png-to-webp", title: "Convert PNG to WebP", desc: "Convert PNG images to modern WebP format for smaller files." },
  { slug: "jpg-to-webp", title: "Convert JPG to WebP", desc: "Convert JPEG/JPG images to WebP and save bandwidth." },
  { slug: "png-to-avif", title: "Convert PNG to AVIF", desc: "Convert PNG images to AVIF for top-tier compression." },
  { slug: "jpg-to-avif", title: "Convert JPG to AVIF", desc: "Convert JPEG/JPG images to AVIF with great quality." },
  { slug: "webp-to-jpg", title: "Convert WebP to JPG", desc: "Convert WebP images to JPG for compatibility." },
  { slug: "webp-to-png", title: "Convert WebP to PNG", desc: "Convert WebP images to PNG, preserve transparency when possible." },
  { slug: "avif-to-jpg", title: "Convert AVIF to JPG", desc: "Convert AVIF images to JPG for older apps." },

  { slug: "image-optimizer", title: "Image Optimizer", desc: "Optimize images for performance and SEO." },
  { slug: "bulk-image-compressor", title: "Bulk Image Compressor", desc: "Compress multiple images at once (batch workflow)." },
  { slug: "website-image-optimization", title: "Website Image Optimization", desc: "Optimize images to improve Core Web Vitals and page speed." },
  { slug: "ecommerce-image-compressor", title: "E-commerce Image Compressor", desc: "Make product images load fast while staying sharp." },
  { slug: "social-media-image-compressor", title: "Social Media Image Compressor", desc: "Compress images for Instagram, X, and more." },
  { slug: "free-image-compressor", title: "Free Image Compressor", desc: "Use ZipPixel to compress images for free with fair limits." },
  { slug: "online-webp-converter", title: "Online WebP Converter", desc: "Convert images to WebP instantly in your browser." },
];

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);

  if (!tool) {
    return {
      title: "Tool | ZipPixel",
      description: "Image compression and optimization tools.",
      robots: { index: false, follow: true },
    };
  }

  const title = `${tool.title} | ZipPixel`;
  const description = tool.desc;

  return {
    title,
    description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: { title, description, url: `/tools/${tool.slug}`, type: "website" },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);

  // ✅ null check önce (build patlamasın)
  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Tool not found</h1>
        <p className="mt-3 text-muted-foreground">Try our main compressor instead.</p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/compress">Open Compressor</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isCrop = tool.slug.includes("crop");
  const primaryHref = isCrop ? "/crop" : "/compress";
  const primaryLabel = isCrop ? "Crop images now" : "Compress images now";

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">ZipPixel Tools</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">{tool.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{tool.desc}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/pricing">See plans</Link>
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold">Related tools</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TOOLS.slice(0, 12).map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}