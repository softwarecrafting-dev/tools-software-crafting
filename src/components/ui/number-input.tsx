"use client";

import { Minus, Plus } from "lucide-react";
import {
  Button,
  Group,
  Input,
  NumberField,
  type NumberFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<NumberFieldProps, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  placeholder?: string;
  textCenter?: boolean;
}

export function NumberInput({
  value,
  onChange,
  className,
  placeholder,
  minValue = 0,
  step = 0.01,
  textCenter = false,
  ...props
}: NumberInputProps) {
  return (
    <NumberField
      value={value}
      onChange={onChange}
      minValue={minValue}
      step={step}
      className={cn("w-full group/field", className)}
      {...props}
    >
      <Group 
        className="group relative inline-flex h-10 w-full items-center overflow-hidden rounded-lg border border-input bg-background/50 shadow-sm transition-all focus-within:ring-ring/50 focus-within:ring-[3px] focus-within:border-ring data-disabled:opacity-50 data-[invalid]:border-destructive data-[invalid]:ring-destructive/20"
      >
        <Button
          slot="decrement"
          className="flex h-full aspect-square items-center justify-center border-r border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50 outline-none"
        >
          <Minus className="h-3.5 w-3.5" />
          <span className="sr-only">Decrement</span>
        </Button>
        <Input
          placeholder={placeholder}
          className={cn(
            "w-full grow bg-transparent px-3 py-2 text-sm font-medium tabular-nums outline-none placeholder:text-muted-foreground/50",
            textCenter ? "text-center" : "text-right"
          )}
        />
        <Button
          slot="increment"
          className="flex h-full aspect-square items-center justify-center border-l border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50 outline-none"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only">Increment</span>
        </Button>
      </Group>
    </NumberField>
  );
}
