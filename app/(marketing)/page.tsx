import { Hero } from "@/components/landing/hero"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ZipPixel",
  url: "https://zippixel.xyz",
  description: "AI-powered image compression platform",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://zippixel.xyz/compress?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ZipPixel",
  url: "https://zippixel.xyz",
  logo: "https://zippixel.xyz/icon.svg",
  sameAs: [],
}

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ZipPixel",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <main className="flex flex-col">
        <Hero />
        <FeaturesGrid />
        <FAQ />
        <CTA />
      </main>
    </>
  )
}