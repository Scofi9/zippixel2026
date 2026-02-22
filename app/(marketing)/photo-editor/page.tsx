import type { Metadata } from "next";
import PhotoEditorClient from "./photo-editor-client";

export const metadata: Metadata = {
  title: "Photo Editor | ZipPixel",
  description: "Edit your photos online: crop, resize, draw, text, shapes, filters and export.",
};

export default function Page() {
  return <PhotoEditorClient />;
}