import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import PricingPreview from "@/components/landing/pricing-preview"
import CTA from "@/components/landing/cta"

export default function MarketingPage() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Features />
      <PricingPreview />
      <CTA />
    </main>
  )
}