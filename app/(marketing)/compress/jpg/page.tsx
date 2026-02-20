import type { Metadata } from "next";
import { FormatPage } from "@/components/compress/format-page";

export const metadata: Metadata = {
  title: "Compress JPG Online",
  description: "Compress JPG images online. Reduce file size without visible quality loss.",
};

export default function CompressJpgPage() {
  return (
    <FormatPage
      format="jpg"
      title="Compress JPG online"
      description="Shrink JPG files while keeping them sharp and clean. Great for websites, e‑commerce, and sharing."
      benefits={[
        "Smaller files load faster on web and mobile.",
        "Better Core Web Vitals and SEO signals.",
        "Lower bandwidth and CDN costs.",
      ]}
    />
  );
}
