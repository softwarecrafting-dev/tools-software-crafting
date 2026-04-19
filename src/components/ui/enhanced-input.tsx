"use client";

import { cn } from "@/lib/utils";
import { LoaderCircleIcon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Input } from "./input";
import { Label } from "./label";

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isLoading?: boolean;
  onClear?: () => void;
  kbd?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      type,
      label,
      error,
      isLoading,
      onClear,
      kbd,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const id = React.useId();
    const hasValue = value !== undefined && value !== null && value !== "";

    return (
      <div className="w-full space-y-2">
        {label && (
          <Label htmlFor={id} className="text-sm font-medium text-foreground">
            {label}
          </Label>
        )}
        <div className="relative group">
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 transition-colors group-focus-within:text-primary peer-disabled:opacity-50">
            <SearchIcon className="size-4" />
            <span className="sr-only">Search</span>
          </div>

          <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            className={cn(
              "peer pl-9 pr-9 transition-all bg-card/50 focus-visible:ring-2 focus-visible:ring-primary/20",
              error && "border-destructive focus-visible:ring-destructive/20",
              kbd && "pr-12",
              isLoading && "pr-9",
              className,
            )}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
            {isLoading ? (
              <div className="text-muted-foreground animate-spin">
                <LoaderCircleIcon className="size-4" />
                <span className="sr-only">Loading...</span>
              </div>
            ) : hasValue && onClear ? (
              <button
                type="button"
                onClick={onClear}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
                aria-label="Clear input"
              >
                <XIcon className="size-3.5" />
              </button>
            ) : kbd ? (
              <div className="pointer-events-none hidden sm:flex items-center">
                <kbd className="text-muted-foreground bg-accent inline-flex h-5 max-h-full items-center rounded border px-1.5 font-sans text-[0.625rem] font-medium shadow-sm">
                  {kbd}
                </kbd>
              </div>
            ) : null}
          </div>
        </div>

        {error && (
          <p className="text-destructive text-xs font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  },
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput };
