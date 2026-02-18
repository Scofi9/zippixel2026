export const dynamic = "force-dynamic";

import type { Metadata } from "next"
import { FormatPage } from "@/components/compress/format-page"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "AVIF Converter & Compressor — Convert Images to AVIF",
  description:
    "Convert and compress images to AVIF format. Up to 50% smaller than JPEG with superior quality. Free online AVIF converter.",
  keywords: ["avif converter", "convert to avif", "avif compressor", "image to avif"],
  openGraph: {
    title: "AVIF Converter & Compressor",
    description: "Convert images to AVIF. Up to 50% smaller than JPEG with superior quality.",
    url: "https://zippixel.com/compress/avif",
  },
  alternates: { canonical: "https://zippixel.com/compress/avif" },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.com" },
    { "@type": "ListItem", position: 2, name: "Compress", item: "https://zippixel.com/compress" },
    { "@type": "ListItem", position: 3, name: "AVIF", item: "https://zippixel.com/compress/avif" },
  ],
}

export default function CompressAvifPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <FormatPage
        format="avif"
        title="Convert and compress to AVIF"
        description="Convert images to AVIF for up to 50% smaller files than JPEG. The next generation image format with superior compression."
        benefits={[
          "AVIF provides up to 50% better compression than JPEG at equivalent quality.",
          "Based on AV1 video codec — the most advanced compression technology available.",
          "Supports HDR, wide color gamut, and alpha transparency.",
          "Growing browser support including Chrome, Firefox, and Safari.",
          "Future-proof your images with the most efficient format available today.",
        ]}
      />
    </>
  )
}
