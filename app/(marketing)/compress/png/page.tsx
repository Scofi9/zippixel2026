import type { Metadata } from "next"
import { FormatPage } from "@/components/compress/format-page"
import { JsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Compress PNG Online — Free PNG Image Compressor",
  description:
    "Compress PNG images online free. Reduce PNG file size while preserving transparency. AI-powered lossless PNG compression.",
  keywords: ["compress png online", "png compressor", "reduce png size", "optimize png"],
  openGraph: {
    title: "Compress PNG Online — Free PNG Image Compressor",
    description: "Reduce PNG file size while preserving transparency and quality.",
    url: "https://zippixel.com/compress/png",
  },
  alternates: { canonical: "https://zippixel.com/compress/png" },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.com" },
    { "@type": "ListItem", position: 2, name: "Compress", item: "https://zippixel.com/compress" },
    { "@type": "ListItem", position: 3, name: "PNG", item: "https://zippixel.com/compress/png" },
  ],
}

export default function CompressPngPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <FormatPage
        format="png"
        title="Compress PNG images online"
        description="Reduce PNG file size significantly while preserving transparency. Lossless and lossy compression options available."
        benefits={[
          "Preserve alpha transparency while reducing file size dramatically.",
          "Lossless compression removes unnecessary metadata without quality loss.",
          "Lossy mode can achieve 60-80% size reduction with minimal visual impact.",
          "Perfect for logos, icons, UI elements, and graphics with transparency.",
          "Smart palette optimization reduces colors while maintaining visual fidelity.",
        ]}
      />
    </>
  )
}
