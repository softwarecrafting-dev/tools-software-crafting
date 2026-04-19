"use client";

import { SearchInput } from "@/components/ui/search-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import * as React from "react";

export function Header() {
  const [searchValue, setSearchValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = (val: string) => {
    setSearchValue(val);
    if (val) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-background/60 px-6 backdrop-blur-lg supports-backdrop-filter:bg-background/60 border-b">
      <div className="flex flex-1 items-center gap-4">
        <div className="hidden md:block w-full max-w-sm">
          <SearchInput
            placeholder="Search invoices, clients..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch("")}
            isLoading={isLoading}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
