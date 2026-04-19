"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

interface SearchPlaceholderProps {
  onOpen: () => void;
}

export function SearchPlaceholder({ onOpen }: SearchPlaceholderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full cursor-pointer"
      onClick={onOpen}
    >
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        placeholder="Type to search..." 
        className="h-10 w-full bg-muted/50 pl-9 pr-12 text-sm border-transparent transition-all focus-within:bg-background focus-within:ring-1 focus-within:ring-ring hover:bg-muted cursor-pointer"
        readOnly 
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
    </motion.div>
  );
}
