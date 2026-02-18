import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    quote:
      "ZipPixel reduced our page load times by 60%. The AI compression is incredibly smart at preserving quality.",
    name: "Sarah Chen",
    role: "Lead Developer, Raycast",
    initials: "SC",
  },
  {
    quote:
      "We switched from manual image optimization to ZipPixel and saved 20+ hours per week. The batch processing is a game changer.",
    name: "Marcus Johnson",
    role: "CTO, Verifiable",
    initials: "MJ",
  },
  {
    quote:
      "The API integration was seamless. We now compress every image uploaded to our platform in real-time.",
    name: "Emily Rodriguez",
    role: "Engineering Manager, Prisma",
    initials: "ER",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Trusted by engineering teams
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See what developers and teams say about ZipPixel.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card
              key={t.name}
              className="border-border/50 bg-card/50"
            >
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {t.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
