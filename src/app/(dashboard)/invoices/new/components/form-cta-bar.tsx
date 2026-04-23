"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, InfoIcon, Send } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { InvoiceFormValues } from "./invoice-form";

import { SavingIndicator } from "./saving-indicator";

export function FormCTABar({
  saveDraft,
  isSaving,
  lastSavedAt,
}: {
  saveDraft: (data: InvoiceFormValues, isAutosave?: boolean) => Promise<void>;
  isSaving: boolean;
  lastSavedAt: Date | null;
}) {
  const { handleSubmit } = useFormContext<InvoiceFormValues>();

  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-3rem)] max-w-2xl px-6 py-4 bg-background/10 backdrop-blur-lg rounded-2xl border shadow-md ">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SavingIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
        </div>
 
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="save-draft-btn-form"
                variant="outline"
                className="h-10"
                disabled={isSaving}
                onClick={handleSubmit((data) => saveDraft(data))}
              >
                <FileText className="h-4 w-4" />
                Save Draft
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="end"
              className="max-w-64 py-3 text-pretty"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <InfoIcon className="size-4 text-primary" />
                  <p className="text-sm font-semibold">Safe & Syncing</p>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Your changes are automatically saved every 10 seconds. You can
                  also hit{" "}
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>S
                  </kbd>{" "}
                  anytime to manually sync.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>

          <Button id="send-invoice-btn-form" className="h-10 ">
            <Send className="h-4 w-4 " />
            Send Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
