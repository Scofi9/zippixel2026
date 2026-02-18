import type { Metadata } from "next"
import { FormatPage } from "@/components/compress/format-page"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "WebP Converter & Compressor — Convert Images to WebP",
  description:
    "Convert and compress images to WebP format. Up to 30% smaller than JPEG with better quality. Free online WebP converter.",
  keywords: ["webp converter", "convert to webp", "webp compressor", "image to webp"],
  openGraph: {
    title: "WebP Converter & Compressor",
    description: "Convert images to WebP. Up to 30% smaller than JPEG with better quality.",
    url: "https://zippixel.com/compress/webp",
  },
  alternates: { canonical: "https://zippixel.com/compress/webp" },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.com" },
    { "@type": "ListItem", position: 2, name: "Compress", item: "https://zippixel.com/compress" },
    { "@type": "ListItem", position: 3, name: "WebP", item: "https://zippixel.com/compress/webp" },
  ],
}

export default function CompressWebpPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <FormatPage
        format="webp"
        title="Convert and compress to WebP"
        description="Convert JPG, PNG, and other formats to WebP for up to 30% better compression than JPEG. Supported by all modern browsers."
        benefits={[
          "WebP provides 25-35% better compression than JPEG at equivalent quality.",
          "Supports both lossy and lossless compression with alpha transparency.",
          "Widely supported by Chrome, Firefox, Safari, and Edge browsers.",
          "Ideal for web performance optimization and Core Web Vitals improvement.",
          "Convert from any format with one click using our AI engine.",
        ]}
      />
    </>
  )
}
