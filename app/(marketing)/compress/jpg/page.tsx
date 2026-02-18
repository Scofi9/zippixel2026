import type { Metadata } from "next"
import { FormatPage } from "@/components/compress/format-page"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Compress JPG Online — Free JPEG Image Compressor",
  description:
    "Compress JPG images online free. Reduce JPEG file size up to 90% without losing quality. Fast AI-powered JPG compressor.",
  keywords: ["compress jpg online", "jpeg compressor", "reduce jpg size", "compress jpeg"],
  openGraph: {
    title: "Compress JPG Online — Free JPEG Image Compressor",
    description: "Reduce JPEG file size up to 90% without losing quality.",
    url: "https://zippixel.com/compress/jpg",
  },
  alternates: { canonical: "https://zippixel.com/compress/jpg" },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.com" },
    { "@type": "ListItem", position: 2, name: "Compress", item: "https://zippixel.com/compress" },
    { "@type": "ListItem", position: 3, name: "JPG", item: "https://zippixel.com/compress/jpg" },
  ],
}

export default function CompressJpgPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <FormatPage
        format="jpg"
        title="Compress JPG images online"
        description="Reduce JPEG file size up to 90% while maintaining visual quality. Our AI analyzes each JPG and applies optimal compression."
        benefits={[
          "Dramatically reduce JPG file size for faster website loading.",
          "Maintain visual quality that is indistinguishable from the original.",
          "Batch compress multiple JPEG images simultaneously.",
          "Perfect for photography portfolios, e-commerce product images, and blogs.",
          "Optimized for web delivery with progressive JPEG encoding.",
        ]}
      />
    </>
  )
}
