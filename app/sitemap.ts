import type { MetadataRoute } from "next"
function getBaseUrl() {
  const env =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_URL

  if (!env) return "https://zippixel.xyz"
  if (env.startsWith("http://") || env.startsWith("https://")) return env
  return `https://${env}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const now = new Date()

  const staticRoutes = [
    "/",
    "/compress",
    "/compress/jpg",
    "/compress/png",
    "/compress/webp",
    "/compress/avif",
    "/features",
    "/pricing",
    "/docs",
    "/status",
    "/privacy",
    "/tools",
    "/tools/image-compressor",
    "/tools/reduce-image-size",
    "/tools/compress-jpg",
    "/tools/compress-png",
    "/tools/compress-webp",
    "/tools/compress-avif",
    "/tools/png-to-webp",
    "/tools/jpg-to-webp",
    "/tools/png-to-avif",
    "/tools/jpg-to-avif",
    "/tools/webp-to-jpg",
    "/tools/webp-to-png",
    "/tools/avif-to-jpg",
    "/tools/image-optimizer",
    "/tools/bulk-image-compressor",
    "/tools/website-image-optimization",
    "/tools/ecommerce-image-compressor",
    "/tools/social-media-image-compressor",
    "/tools/free-image-compressor",
    "/tools/online-webp-converter",

  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/compress") ? 0.9 : 0.7,
  }))

  return staticEntries
}

