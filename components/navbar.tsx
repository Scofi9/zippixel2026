"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
]

const userButtonAppearance = {
  elements: {
    userButtonPopoverCard:
      "w-72 rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl",
    userButtonPopoverMain: "p-3",
    userButtonPopoverFooter: "hidden",
    userButtonPopoverActionButton:
      "rounded-xl hover:bg-white/5 transition-colors",
    userButtonPopoverActionButtonText: "text-sm text-white/80",
    userButtonPopoverActionButtonIcon: "text-white/60",
    userButtonPopoverUserPreview: "rounded-xl bg-white/5",
    userButtonPopoverUserPreviewTextContainer: "gap-0.5",
    userButtonPopoverUserPreviewMainIdentifier: "text-sm text-white",
    userButtonPopoverUserPreviewSecondaryIdentifier: "text-xs text-white/60",
    userButtonAvatarBox: "h-9 w-9 ring-1 ring-white/10",
  },
} as const

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/80 dark:bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 lg:px-8">
        <div className="flex items-center justify-start">
          <Logo />
        </div>

        {/* Desktop nav */}
        <div className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          <ThemeToggle />

          <SignedOut>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Log in</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </SignedIn>

          <Button size="sm" asChild>
            <Link href="/compress">Compress Images</Link>
          </Button>

          {/* Avatar en sağ */}
          <SignedIn>
            <UserButton afterSignOutUrl="/" appearance={userButtonAppearance} />
          </SignedIn>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center justify-end md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-80 bg-background">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>

            <div className="flex flex-col gap-6 pt-8">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                      pathname === link.href
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-2 px-3">
                <SignedOut>
                  <Button variant="outline" asChild>
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                </SignedOut>

                <SignedIn>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                </SignedIn>

                <Button asChild>
                  <Link href="/compress" onClick={() => setOpen(false)}>
                    Compress Images
                  </Link>
                </Button>

                {/* Mobilde avatar da gösterelim */}
                <SignedIn>
                  <div className="mt-2 flex justify-end">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={userButtonAppearance}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>
          </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}