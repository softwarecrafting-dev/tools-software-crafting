"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CircleX, LoaderCircle, Search } from "lucide-react";
import * as React from "react";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  onClear?: () => void;
  kbd?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, isLoading, onClear, value, onChange, kbd = "⌘K", ...props },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const combinedRef =
      (ref as React.MutableRefObject<HTMLInputElement>) || internalRef;

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      if (combinedRef.current) {
        combinedRef.current.focus();
      }
    };

    const hasValue = value && String(value).length > 0;

    return (
      <div className={cn("relative w-full", className)}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground">
          <Search className="size-4" />
          <span className="sr-only">Search</span>
        </div>

        <Input
          ref={combinedRef}
          type="search"
          value={value}
          onChange={onChange}
          className={cn(
            "peer pl-9 pr-12 bg-muted/40 transition-all hover:bg-muted/80 focus:bg-background [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          )}
          {...props}
        />

        <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-1">
          {isLoading ? (
            <div className="flex size-8 items-center justify-center text-muted-foreground ">
              <LoaderCircle className="size-4 animate-spin" />
              <span className="sr-only">Loading...</span>
            </div>
          ) : hasValue ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="size-8 text-muted-foreground hover:bg-transparent hover:text-foreground mr-1"
            >
              <CircleX className="size-4" />
              <span className="sr-only">Clear input</span>
            </Button>
          ) : kbd ? (
            <div className="pointer-events-none flex items-center pr-3">
              <kbd className="inline-flex h-5 max-h-full items-center rounded border bg-accent px-1.5 font-sans text-[10px] font-medium text-muted-foreground opacity-100">
                {kbd}
              </kbd>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
