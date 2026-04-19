"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import { ActivityViewer } from "./activity-viewer";
import { HeaderGreeting, SidebarToggle } from "./header-greeting";
import { HeaderSearch } from "./header-search";
import { LanguageSelector } from "./language-selector";
import { NotificationsDropdown } from "./notifications-dropdown";
import { UserNav } from "./user-nav";

export function Header() {
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isHidden = scrollDirection === "down" && !isAtTop;

  return (
    <header
      className={cn(
        " flex h-20 w-full items-center justify-between bg-transparent px-6 transition-transform duration-300 ease-in-out md:h-24 py-4",
        isHidden ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <div className="flex items-center gap-6">
        <SidebarToggle />
        <HeaderGreeting />
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <HeaderSearch />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSelector />
          <ActivityViewer />
          <NotificationsDropdown />
          <ThemeToggle />
          <UserNav
            user={{
              email: "john.doe@example.com",
              name: "John Doe",
            }}
          />
        </div>
      </div>
    </header>
  );
}
