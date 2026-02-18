import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "Blog — Image Optimization Insights",
  description:
    "Learn about image compression, optimization techniques, web performance, and modern image formats. Expert insights from the ZipPixel team.",
  openGraph: {
    title: "Blog — ZipPixel",
    description: "Expert insights on image compression, web performance, and modern formats.",
    url: "https://zippixel.com/blog",
  },
  alternates: { canonical: "https://zippixel.com/blog" },
}

export default function BlogPage() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Expert insights on image compression, web performance, and modern
            image formats.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full border-border/50 bg-card/50 transition-colors hover:border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-foreground leading-snug">
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {post.author}
                      </span>{" "}
                      &middot; {post.date}
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
