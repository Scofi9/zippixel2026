import type { Metadata } from "next";
import { FormatPage } from "@/components/compress/format-page";

export const metadata: Metadata = {
  title: "WebP Converter",
  description: "Convert images to WebP for smaller files with great quality.",
};

export default function WebpPage() {
  return (
    <FormatPage
      format="webp"
      title="Convert to WebP"
      description="WebP delivers excellent compression with great visual quality. Ideal for modern websites."
      benefits={[
        "Often 25–35% smaller than JPG at similar quality.",
        "Supports transparency.",
        "Great default for modern browsers.",
      ]}
    />
  );
}
