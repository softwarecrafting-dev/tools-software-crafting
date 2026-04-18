"use client";

import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Search } from "lucide-react";
import { UserNav } from "./user-nav";

interface HeaderProps {
  user: {
    name?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices, clients..."
            className="pl-9 bg-muted/40 transition-all hover:bg-muted/80 focus:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserNav user={user} />
      </div>
    </header>
  );
}
