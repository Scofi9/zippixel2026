import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

type Tool = { slug: string; title: string; desc: string };

const TOOLS: Tool[] = [
  { slug: "compress-image", title: "Compress Image", desc: "Compress images online in seconds. Reduce file size while keeping quality." },
  { slug: "crop-image", title: "Crop Image", desc: "Crop images online with precision. Export to JPG, PNG, WebP, or AVIF." },
  { slug: "photo-editor", title: "Photo Editor", desc: "Edit photos online: crop, resize, draw, text, shapes, filters and export." },

  // İstersen çoğalt: SEO slugları
  { slug: "compress-jpg", title: "Compress JPG", desc: "Shrink JPG images online quickly with great quality." },
  { slug: "compress-png", title: "Compress PNG", desc: "Reduce PNG size while preserving transparency." },
  { slug: "png-to-webp", title: "Convert PNG to WebP", desc: "Convert PNG images to WebP for smaller files." },
];

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

function getTool(slug: string) {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);

  // ✅ null-safe metadata
  if (!tool) {
    return {
      title: "Tool | ZipPixel",
      description: "Image tools by ZipPixel.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${tool.title} | ZipPixel`,
    description: tool.desc,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.title} | ZipPixel`,
      description: tool.desc,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);

  // ✅ null check EN ÖNCE
  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Tool not found</h1>
        <p className="mt-3 text-muted-foreground">Try our main tools instead.</p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/compress">Compress</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/crop">Crop</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/photo-editor">Photo Editor</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ✅ artık güvenle kullanabiliriz
  const isCrop = tool.slug.includes("crop");
  const isEditor = tool.slug === "photo-editor";

  const primaryHref = isEditor ? "/photo-editor" : isCrop ? "/crop" : "/compress";
  const primaryLabel = isEditor ? "Open Photo Editor" : isCrop ? "Crop images now" : "Compress images now";

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
            {TOOLS.map((t) => (
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