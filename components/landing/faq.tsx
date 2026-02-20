"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useI18n } from "@/components/i18n-provider"

const faqs = [
  {
    question: "How does ZipPixel compress images without losing quality?",
    answer:
      "ZipPixel uses perceptual compression to remove what humans can’t see, while preserving what matters. The engine picks the best settings per image, so you get smaller files without visible quality loss.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "ZipPixel supports JPG/JPEG, PNG, WebP, and AVIF. You can also choose an output format or let Auto pick the best one.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "Limits depend on your plan. Free users can compress smaller files, and higher plans unlock larger uploads and more monthly volume.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Transfers are encrypted in transit. Files are stored temporarily only for processing and then expire automatically.",
  },
  {
    question: "Can I integrate ZipPixel into my workflow?",
    answer:
      "Yes. We’re shipping API access for Pro+ plans. You’ll manage keys from Settings and integrate with a simple REST endpoint.",
  },
]

export function FAQ() {
  const { t } = useI18n()

  return (
    <section className="py-20 sm:py-24 lg:py-32 border-t border-border/50">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl">
            {t("faq_title")}
          </h2>
          <p className="mt-4 text-pretty text-base sm:text-lg text-muted-foreground">
            {t("faq_subtitle")}
          </p>
        </div>

        <div className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={String(idx)} className="border-border/50">
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
