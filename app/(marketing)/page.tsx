import { Hero } from "@/components/landing/hero"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { PricingPreview } from "@/components/landing/pricing-preview"
import { FAQ } from "@/components/landing/faq"
import { CTA } from "@/components/landing/cta"
import { JsonLd } from "@/components/json-ld"

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ZipPixel",
  url: "https://zippixel.com",
  description: "AI-powered image compression platform",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://zippixel.com/compress?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ZipPixel",
  url: "https://zippixel.com",
  logo: "https://zippixel.com/icon.svg",
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
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={softwareSchema} />
      <Hero />
      <FeaturesGrid />
      <PricingPreview />
      <FAQ />
      <CTA />
    </>
  )
}
