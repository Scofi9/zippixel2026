"use client";

import dynamic from "next/dynamic";

const PhotoEditor = dynamic(() => import("@/components/editor/photo-editor"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border bg-card p-8">
        <div className="text-sm text-muted-foreground">Loading editor...</div>
        <div className="mt-4 h-40 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  ),
});

export default function PhotoEditorClient() {
  return <PhotoEditor />;
}