export type PlanKey = "free" | "basic" | "pro" | "plus"

export const PLANS: Record<
  PlanKey,
  {
    name: string
    monthlyLimitImages: number
    maxFileMb: number
  }
> = {
  free: { name: "Free", monthlyLimitImages: 50, maxFileMb: 5 },
  basic: { name: "Basic", monthlyLimitImages: 300, maxFileMb: 10 },
  pro: { name: "Pro", monthlyLimitImages: 2000, maxFileMb: 25 },
  plus: { name: "Plus", monthlyLimitImages: 10000, maxFileMb: 50 },
}