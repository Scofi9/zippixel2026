import { Upload, Cpu, Download } from "lucide-react"

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Images",
    description:
      "Drag and drop or browse to upload your images. We support JPG, PNG, WebP, AVIF, and more.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Compression",
    description:
      "Our AI analyzes each image and applies the optimal compression settings automatically.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download Optimized Files",
    description:
      "Get your compressed images instantly. Up to 90% smaller with no visible quality loss.",
  },
]

export function HowItWorks() {
  return (
    <section className="border-y border-border/50 bg-secondary/30 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Three simple steps to dramatically reduce your image file sizes.
          </p>
        </div>
        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="size-6 text-primary" />
              </div>
              <div className="mt-4 text-sm font-semibold text-primary">
                Step {step.step}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
