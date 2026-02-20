import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { SupportWidget } from "@/components/support-widget"
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
  metadataBase: new URL("https://zippixel.xyz"),
  title: {
    default: "ZipPixel — AI Image Compressor",
    template: "%s · ZipPixel",
  },
  description:
    "Compress images instantly without losing quality. Free and fast AI image compressor for JPG, PNG, WebP, and AVIF.",
  keywords: [
    "compress image",
    "compress images",
    "image compressor",
    "reduce image size",
    "compress jpg",
    "compress png",
    "webp compressor",
    "avif compressor",
    "online image optimizer",
  ],
  alternates: {
    canonical: "https://zippixel.xyz",
  },
  openGraph: {
    type: "website",
    url: "https://zippixel.xyz",
    title: "ZipPixel — AI Image Compressor",
    description:
      "Compress images instantly without losing quality. Free and fast AI image compressor.",
    siteName: "ZipPixel",
  },
  twitter: {
    card: "summary",
    title: "ZipPixel — AI Image Compressor",
    description:
      "Compress images instantly without losing quality. Free and fast AI image compressor.",
  },
};


export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable}`}
      >
        <body className="font-sans antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <I18nProvider>{children}<SupportWidget /></I18nProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}