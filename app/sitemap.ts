import type { MetadataRoute } from "next"
import { blogPosts } from "@/lib/blog-data"

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
    "/blog",
  ]

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/compress") ? 0.9 : 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...blogEntries]
}
