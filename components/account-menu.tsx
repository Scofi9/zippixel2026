"use client";

import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

function initials(name?: string | null) {
  const v = (name ?? "").trim();
  if (!v) return "U";
  const parts = v.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

export function AccountMenu() {
  const { user } = useUser();
  if (!user) return null;

  const displayName = user.fullName || user.firstName || user.username || "User";
  const imageUrl = user.imageUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="size-8 ring-1 ring-border/60">
          <AvatarImage src={imageUrl} alt={displayName} />
          <AvatarFallback className="text-xs">{initials(displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <div className="text-sm font-semibold truncate">{displayName}</div>
          <div className="text-xs text-muted-foreground truncate">
            {user.primaryEmailAddress?.emailAddress}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center gap-2">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <SignOutButton redirectUrl="/">
            <button className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
              <LogOut className="size-4" />
              Sign out
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
