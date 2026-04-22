"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="group relative w-full">
        <label
          htmlFor={inputId}
          className="absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm text-muted-foreground transition-all 
            origin-start 
            group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground
            has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
        >
          <span className="bg-background inline-flex px-1">{label}</span>
        </label>
        <Input
          ref={ref}
          id={inputId}
          placeholder=" "
          className={cn("dark:bg-background h-10", className)}
          {...props}
        />
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const FloatingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FloatingTextareaProps
>(({ label, className, id, ...props }, ref) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;

  return (
    <div className="group relative w-full">
      <label
        htmlFor={textareaId}
        className="absolute top-5 block -translate-y-1/2 cursor-text px-2 text-sm text-muted-foreground transition-all 
          origin-start 
          group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground
          has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:top-0 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium has-[+textarea:not(:placeholder-shown)]:text-foreground"
      >
        <span className="bg-background inline-flex px-1">{label}</span>
      </label>
      <Textarea
        ref={ref}
        id={textareaId}
        placeholder=" "
        className={cn(
          "dark:bg-background min-h-[80px] max-h-16 overflow-y-auto",
          className,
        )}
        {...props}
      />
    </div>
  );
});
FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingInput, FloatingTextarea };
