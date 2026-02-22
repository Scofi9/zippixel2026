import type { Metadata } from "next";
import PhotoEditorClient from "./photo-editor-client";

export const metadata: Metadata = {
  title: "Photo Editor | ZipPixel",
  description:
    "Edit photos online: crop, resize, rotate, draw, add text, shapes, stickers, and export to JPG/PNG/WebP/AVIF.",
};

export default function PhotoEditorPage() {
  return <PhotoEditorClient />;
}
