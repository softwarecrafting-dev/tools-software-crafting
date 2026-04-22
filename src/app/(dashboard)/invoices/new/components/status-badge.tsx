"use client";

import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    className: "bg-muted/60 text-muted-foreground border-border/60",
  },
  sent: {
    label: "Sent",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800",
  },
  paid: {
    label: "Paid",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
  },
  overdue: {
    label: "Overdue",
    className:
      "bg-red-500/10 text-red-600 border-red-200 dark:text-red-400 dark:border-red-800",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "bg-muted/40 text-muted-foreground line-through border-border/40",
  },
} as const;

export type InvoiceStatus = keyof typeof STATUS_CONFIG;

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <Badge
      variant="outline"
      className={` font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}
    >
      {cfg.label}
    </Badge>
  );
}
