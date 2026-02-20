import type { Metadata } from "next"
import UploadZone from "@/components/compress/upload-zone"
import { JsonLd } from "@/components/json-ld"
import { CompressHero } from "@/components/compress/compress-hero"

export const dynamic = "force-dynamic"

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
    url: "https://zippixel.xyz/compress",
  },
  alternates: {
    canonical: "https://zippixel.xyz/compress",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.xyz" },
    { "@type": "ListItem", position: 2, name: "Compress Images", item: "https://zippixel.xyz/compress" },
  ],
}

export default function CompressPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <section className="py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <CompressHero />
          <div className="mt-10 sm:mt-12">
            <UploadZone />
          </div>
        </div>
      </section>
    </>
  )
}
