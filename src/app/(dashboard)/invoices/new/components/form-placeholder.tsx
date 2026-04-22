"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";

interface FormPlaceholderProps {
  section: number;
  title: string;
  description: string;
  fields: string[];
  nextInvoiceNumber?: string;
}

export function FormPlaceholder({
  section,
  title,
  description,
  fields,
  nextInvoiceNumber,
}: FormPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: section * 0.04, ease: "easeOut" }}
      className="rounded-xl border bg-card overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b bg-muted/20">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {section}
        </span>

        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {fields.map((f) => (
            <span
              key={f}
              className="inline-flex items-center rounded-lg border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground"
            >
              {f === "Invoice Number" && nextInvoiceNumber ? (
                <span className="font-mono font-semibold text-foreground">
                  {nextInvoiceNumber}
                </span>
              ) : (
                f
              )}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground/60 italic">
          Section fields will be built
        </p>
      </div>
    </motion.div>
  );
}

export function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-0 h-full">
      <div className="border-r p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b bg-muted/20">
              <Skeleton className="h-6 w-6 rounded-full" />

              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 + (i % 2) }).map((_, j) => (
                  <Skeleton key={j} className="h-8 w-24 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:flex flex-col">
        <div className="flex gap-1 p-3 border-b bg-muted/30">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 flex-1 rounded-md" />
          ))}
        </div>

        <div className="flex-1 p-4">
          <Skeleton className="h-full min-h-[400px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
