import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TOOLS, getTool } from "@/lib/tools";

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);

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

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-medium">Best for</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Websites, e-commerce, social media, and anywhere you need faster image delivery.
            </p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <h2 className="font-medium">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload your image, choose output format and quality, then download the optimized result.
              Your usage limit depends on your plan.
            </p>
          </div>
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