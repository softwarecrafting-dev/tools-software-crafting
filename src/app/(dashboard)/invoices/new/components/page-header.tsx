"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Send } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { StatusBadge } from "./status-badge";

export function PageHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="shrink-0 rounded-lg"
          >
            <Link href="/invoices" aria-label="Back to invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg font-semibold tracking-tight truncate">
              Create Invoice
            </h1>
            <StatusBadge status="draft" />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <Button
            id="save-draft-btn-header"
            variant="outline"
            className="hidden sm:flex shadow-sm hover:shadow-md transition-all"
          >
            <FileText className="h-4 w-4" />
            Save Draft
          </Button>

          <Button
            id="send-invoice-btn-header"
            className="shadow-sm hover:shadow-md transition-all"
          >
            <Send className="h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
