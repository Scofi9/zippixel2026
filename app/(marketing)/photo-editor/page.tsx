import dynamic from "next/dynamic";

const PhotoEditor = dynamic(() => import("@/components/editor/photo-editor"), { ssr: false });

export const metadata = {
  title: "Photo Editor | ZipPixel",
  description: "Edit photos online: crop, resize, rotate, draw, add text, shapes, stickers, and export to JPG/PNG/WebP/AVIF.",
};

export default function PhotoEditorPage() {
  return <PhotoEditor />;
}
