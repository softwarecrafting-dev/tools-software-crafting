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
      className="sticky top-0 z-20 "
    >
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-1 min-w-0">
          <Button variant="ghost" size="icon" asChild className="">
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
            className="hidden sm:flex "
          >
            <FileText className="h-4 w-4" />
            Save Draft
          </Button>

          <Button id="send-invoice-btn-header" className="">
            <Send className="h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
