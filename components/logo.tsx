import Link from "next/link"
import { Zap } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-foreground">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
        <Zap className="size-4 text-primary-foreground" />
      </div>
      <span className="text-lg font-bold tracking-tight">ZipPixel</span>
    </Link>
  )
}
