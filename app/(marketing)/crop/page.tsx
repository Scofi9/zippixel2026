import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { CropHero } from "@/components/crop/crop-hero";
import { CropTool } from "@/components/crop/crop-tool";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crop Images Online — Free Image Cropper",
  description:
    "Crop images online in seconds. Reframe photos, export to JPG/PNG/WebP/AVIF, and keep quality.",
  keywords: ["crop image", "image cropper", "crop online", "resize", "reframe"],
  openGraph: {
    title: "Crop Images Online — ZipPixel",
    description: "Crop and reframe images instantly. Export in modern formats.",
    url: "https://zippixel.xyz/crop",
  },
  alternates: { canonical: "https://zippixel.xyz/crop" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.xyz" },
    { "@type": "ListItem", position: 2, name: "Crop Images", item: "https://zippixel.xyz/crop" },
  ],
};

export default function CropPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <section className="py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <CropHero />
          <CropTool />
        </div>
      </section>
    </>
  );
}
