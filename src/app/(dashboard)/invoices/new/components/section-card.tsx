"use client";

import type { ReactNode } from "react";

interface SectionCardProps {
  section: number;
  title: string;
  children: ReactNode;
}

export function SectionCard({ section, title, children }: SectionCardProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b bg-muted/20">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {section}
        </span>
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
