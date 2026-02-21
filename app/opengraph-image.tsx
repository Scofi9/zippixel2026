import { ImageResponse } from "next/og"

export const runtime = "edge"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050610 0%, #0b1024 45%, #0a0a12 100%)",
          color: "white",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ width: 980, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(99, 102, 241, 0.18)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
              }}
            >
              Z
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, opacity: 0.95 }}>ZipPixel</div>
          </div>

          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>
            Compress images
            <br />
            without losing quality
          </div>

          <div style={{ fontSize: 26, opacity: 0.85 }}>
            JPG · PNG · WebP · AVIF — fast, clean, and reliable.
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(99, 102, 241, 0.18)",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              zippixel.xyz
            </div>
          </div>
        </div>
      </div>
    ),
    size
  )
}
