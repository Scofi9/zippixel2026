import Link from "next/link"
import Image from "next/image"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-foreground">
      <Image src="/icon.svg" alt="ZipPixel" width={32} height={32} className="rounded-lg" priority />
      <span className="text-lg font-bold tracking-tight">ZipPixel</span>
    </Link>
  )
}
