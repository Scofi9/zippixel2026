"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does ZipPixel compress images without losing quality?",
    answer:
      "ZipPixel uses advanced AI models trained on millions of images to intelligently identify which data can be removed without visible quality loss. Our algorithms optimize compression settings for each image individually, resulting in dramatic file size reductions while maintaining visual fidelity.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "ZipPixel supports all major image formats including JPG/JPEG, PNG, WebP, AVIF, GIF, SVG, and TIFF. You can also convert between formats during compression to find the optimal format for your use case.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Free users can upload images up to 5MB. Pro users have a 50MB limit per image, and Enterprise customers have no file size restrictions. Batch uploads are available on all plans.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All images are encrypted in transit using TLS 1.3 and encrypted at rest. Images are automatically deleted from our servers within 1 hour of processing. We are SOC 2 Type II certified and GDPR compliant.",
  },
  {
    question: "Can I integrate ZipPixel into my existing workflow?",
    answer:
      "Absolutely. Pro and Enterprise plans include full API access with SDKs for JavaScript, Python, Go, Ruby, and PHP. We also offer integrations with popular tools like Figma, WordPress, and Shopify.",
  },
  {
    question: "What happens if I exceed my monthly limit?",
    answer:
      "You'll receive a notification when you reach 80% of your monthly quota. If you exceed your limit, additional images will be queued until your quota resets or you upgrade your plan. No surprise charges.",
  },
]

export function FAQ() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Everything you need to know about ZipPixel.
          </p>
        </div>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
