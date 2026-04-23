"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, FileText, InfoIcon, Send } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { InvoiceFormValues } from "./invoice-form";
import { SavingIndicator } from "./saving-indicator";
import { StatusBadge } from "./status-badge";

const GUIDANCE_KEY = "invoice_save_guidance_seen_session";

export function PageHeader({
  isSaving,
  lastSavedAt,
  saveDraft,
}: {
  isSaving: boolean;
  lastSavedAt: Date | null;
  saveDraft: (data: InvoiceFormValues, isAutosave?: boolean) => Promise<void>;
}) {
  const { handleSubmit } = useFormContext<InvoiceFormValues>();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [shouldShowGuidance, setShouldShowGuidance] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem(GUIDANCE_KEY);
    if (!seen) {
      const openTimer = setTimeout(() => {
        setShouldShowGuidance(true);
        setIsTooltipOpen(true);
        sessionStorage.setItem(GUIDANCE_KEY, "true");

        const closeTimer = setTimeout(() => {
          setIsTooltipOpen(false);
          setShouldShowGuidance(false);
        }, 6000);

        return () => clearTimeout(closeTimer);
      }, 2000);
      return () => clearTimeout(openTimer);
    }
  }, []);

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

        <div className="flex items-center gap-4">
          <SavingIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />

          <div className="flex items-center gap-2 shrink-0">
            <Tooltip
              open={isTooltipOpen}
              onOpenChange={(open) => {
                if (shouldShowGuidance) setIsTooltipOpen(open);
              }}
            >
              <TooltipTrigger asChild>
                <Button
                  id="save-draft-btn-header"
                  variant="outline"
                  className="hidden sm:flex"
                  disabled={isSaving}
                  onClick={handleSubmit((data) => saveDraft(data))}
                >
                  <FileText className="h-4 w-4" />
                  Save Draft
                </Button>
              </TooltipTrigger>
              {shouldShowGuidance && (
                <TooltipContent
                  align="end"
                  className="max-w-64 py-3 text-pretty"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-center gap-1">
                      <InfoIcon className="size-4 text-primary" />
                      <p className="text-sm  font-semibold">Safe & Syncing</p>
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-relaxed text-center">
                      Your changes are automatically saved every 10 seconds. You
                      can also hit{" "}
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>S
                      </kbd>{" "}
                      anytime to manually sync.
                    </p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>

            <Button id="send-invoice-btn-header" className="">
              <Send className="h-4 w-4" />
              Send Invoice
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
