export type PlanKey = "free" | "basic" | "pro" | "plus"

export const PLANS: Record<
  PlanKey,
  {
    name: string
    monthlyLimitImages: number
    maxFileMb: number
  }
> = {
  free: { name: "Free", monthlyLimitImages: 10, maxFileMb: 5 },
  basic: { name: "Basic", monthlyLimitImages: 250, maxFileMb: 10 },
  pro: { name: "Pro", monthlyLimitImages: 1000, maxFileMb: 25 },
  plus: { name: "Plus", monthlyLimitImages: 2500, maxFileMb: 50 },
}