import type { Metadata } from "next"
import { UploadZone } from "@/components/compress/upload-zone"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Compress Images Online — Free AI Image Compressor",
  description:
    "Compress image online free. Reduce JPG, PNG, WebP, AVIF file size up to 90% without quality loss. AI-powered image compressor by ZipPixel.",
  keywords: [
    "compress image online",
    "image compressor",
    "reduce image size",
    "compress jpg",
    "compress png",
    "online image compressor",
  ],
  openGraph: {
    title: "Compress Images Online — Free AI Image Compressor",
    description:
      "Reduce image file size up to 90% without quality loss. Free AI-powered image compressor.",
    url: "https://zippixel.com/compress",
  },
  alternates: {
    canonical: "https://zippixel.com/compress",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://zippixel.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Compress Images",
      item: "https://zippixel.com/compress",
    },
  ],
}

export default function CompressPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Compress images online
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
              Reduce image file size up to 90% without losing quality. AI-powered
              compression for JPG, PNG, WebP, and AVIF.
            </p>
          </div>
          <div className="mt-12">
            <UploadZone />
          </div>
        </div>
      </section>
    </>
  )
}
