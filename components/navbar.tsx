"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { AccountMenu } from "@/components/account-menu"
import { useI18n } from "@/components/i18n-provider"

const navLinks = [
  { key: "nav_features" as const, href: "/features" },
  { key: "nav_pricing" as const, href: "/pricing" },
  { key: "nav_docs" as const, href: "/docs" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 dark:bg-background/60 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Left: brand */}
        <div className="flex items-center gap-3">
          <Logo />
        </div>

        {/* Center: tools + nav (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <Button size="sm" asChild className="h-9 rounded-full px-4">
            <Link href="/compress">{t("nav_compress")}</Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="h-9 rounded-full px-4">
            <Link href="/crop">{t("nav_crop")}</Link>
          </Button>

          <div className="mx-2 h-6 w-px bg-border/60" />

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-[15px] font-semibold transition-colors hover:text-foreground hover:bg-accent/40",
                pathname === link.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right: actions */}
        <div className="hidden items-center justify-end gap-2 md:flex">
          <LanguageToggle />
          <ThemeToggle />

          <SignedOut>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">{t("nav_login")}</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">{t("nav_dashboard")}</Link>
            </Button>
          </SignedIn>

          <SignedIn>
            <AccountMenu />
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
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
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
                    {t(link.key)}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-2 px-3">
                <SignedOut>
                  <Button variant="outline" asChild>
                    <Link href="/sign-in" onClick={() => setOpen(false)}>
                      {t("nav_login")}
                    </Link>
                  </Button>
                </SignedOut>

                <SignedIn>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      {t("nav_dashboard")}
                    </Link>
                  </Button>
                </SignedIn>

                <div className="grid grid-cols-2 gap-2">
                  <Button asChild>
                    <Link href="/compress" onClick={() => setOpen(false)}>
                      {t("nav_compress")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/crop" onClick={() => setOpen(false)}>
                      {t("nav_crop")}
                    </Link>
                  </Button>
                </div>

                <SignedIn>
                  <div className="mt-2 flex justify-end">
                    <AccountMenu />
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