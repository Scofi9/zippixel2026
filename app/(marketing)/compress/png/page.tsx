import type { Metadata } from "next";
import { FormatPage } from "@/components/compress/format-page";

export const metadata: Metadata = {
  title: "Compress PNG Online",
  description: "Compress PNG images online. Optimize PNG size while preserving transparency.",
};

export default function CompressPngPage() {
  return (
    <FormatPage
      format="png"
      title="Compress PNG online"
      description="Optimize PNGs while preserving transparency. Perfect for UI assets, logos, and screenshots."
      benefits={[
        "Preserves transparency for UI and logos.",
        "Lossless PNG optimization when possible.",
        "Reduce upload and storage size for assets.",
      ]}
    />
  );
}
