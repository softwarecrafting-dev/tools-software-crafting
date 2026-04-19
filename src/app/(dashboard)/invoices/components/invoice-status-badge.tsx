"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const statusConfig = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-700 border-slate-200" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  overdue: { label: "Overdue", className: "bg-rose-100 text-rose-700 border-rose-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-500 border-gray-200" },
  viewed: { label: "Viewed", className: "bg-blue-100 text-blue-700 border-blue-200" },
};

export function InvoiceStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || { 
    label: status, 
    className: "bg-slate-100 text-slate-700" 
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Badge 
        variant="outline" 
        className={cn("font-medium capitalize px-2.5 py-0.5", config.className)}
      >
        {config.label}
      </Badge>
    </motion.div>
  );
}
