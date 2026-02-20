import type { Metadata } from "next";
import { FormatPage } from "@/components/compress/format-page";

export const metadata: Metadata = {
  title: "AVIF Converter",
  description: "Convert images to AVIF for maximum compression with high visual quality.",
};

export default function AvifPage() {
  return (
    <FormatPage
      format="avif"
      title="Convert to AVIF"
      description="AVIF can produce dramatically smaller files with impressive quality. Best for performance‑focused sites."
      benefits={[
        "Often the smallest output format for photos.",
        "High quality at lower bitrates.",
        "Perfect for performance‑critical pages.",
      ]}
    />
  );
}
