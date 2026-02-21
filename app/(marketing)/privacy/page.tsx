import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Privacy & File Deletion | ZipPixel",
  description:
    "Learn how ZipPixel handles uploads, privacy, and when files are deleted.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <p className="text-sm text-muted-foreground">ZipPixel</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Privacy & File Deletion
        </h1>
        <p className="mt-4 text-muted-foreground">
          ZipPixel is built to be simple and safe. Here’s how we handle your
          files and data.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-lg font-semibold">Uploads</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              When you upload an image, it is processed to generate an optimized
              output (like WebP or AVIF) and returned for download.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">File deletion</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We aim to delete generated outputs after a short period. Your
              history (if you are signed in) stores metadata about your
              compressions so you can re-download. If you need stricter deletion
              guarantees for your use case, contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Account data</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Authentication is handled by Clerk. ZipPixel stores plan/usage
              information in your account metadata to enforce limits and improve
              your experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We recommend using ZipPixel over HTTPS only. We also apply rate
              limits to public endpoints to prevent abuse.
            </p>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/compress">Try ZipPixel</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">Read docs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
