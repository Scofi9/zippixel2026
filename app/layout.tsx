import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: {
    default: "ZipPixel — AI-Powered Image Compression",
    template: "%s | ZipPixel",
  },
  description:
    "Compress images online without losing quality. AI-powered image compressor for JPG, PNG, WebP, and AVIF. Reduce file size up to 90% instantly.",
  keywords: [
    "compress image online",
    "image compressor",
    "compress jpg online",
    "compress png online",
    "webp converter",
    "avif converter",
    "reduce image size",
    "ai image compression",
  ],
  metadataBase: new URL("https://zippixel.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zippixel.com",
    siteName: "ZipPixel",
    title: "ZipPixel — AI-Powered Image Compression",
    description:
      "Compress images online without losing quality. Reduce file size up to 90% instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZipPixel — AI-Powered Image Compression",
    description:
      "Compress images online without losing quality. Reduce file size up to 90% instantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
