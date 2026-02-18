import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { blogPosts, getBlogPost } from "@/lib/blog-data"
import { JsonLd } from "@/components/json-ld"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      url: `https://zippixel.com/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `https://zippixel.com/blog/${post.slug}` },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "ZipPixel",
      url: "https://zippixel.com",
    },
    mainEntityOfPage: `https://zippixel.com/blog/${post.slug}`,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://zippixel.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://zippixel.com/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://zippixel.com/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <article className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Button variant="ghost" size="sm" asChild className="mb-8">
            <Link href="/blog">
              <ArrowLeft className="mr-1 size-4" />
              Back to Blog
            </Link>
          </Button>

          <header>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{post.category}</Badge>
              <span className="text-sm text-muted-foreground">
                {post.readTime}
              </span>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-sm text-primary">
                  {post.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {post.author}
                </div>
                <div className="text-xs text-muted-foreground">
                  {post.authorRole} &middot; {post.date}
                </div>
              </div>
            </div>
          </header>

          <div className="prose-custom mt-12">
            {post.content.split("\n\n").map((paragraph, i) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-10 mb-4 text-xl font-semibold text-foreground"
                  >
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              }
              if (paragraph.match(/^\d\./)) {
                const items = paragraph.split("\n")
                return (
                  <ol
                    key={i}
                    className="my-4 flex flex-col gap-1.5 pl-6 list-decimal"
                  >
                    {items.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm leading-relaxed text-muted-foreground"
                      >
                        {item.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                  </ol>
                )
              }
              return (
                <p
                  key={i}
                  className="my-4 text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              )
            })}
          </div>
        </div>
      </article>
    </>
  )
}
