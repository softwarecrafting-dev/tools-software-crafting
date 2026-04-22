"use client";

import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";

export function FormCTABar() {
  return (
    <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-end gap-2 px-6 py-3">
        <Button
          id="save-draft-btn-form"
          variant="outline"
          className="shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <FileText className="h-4 w-4" />
          Save Draft
        </Button>

        <Button
          id="send-invoice-btn-form"
          className="shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Send className="h-4 w-4" />
          Send Invoice
        </Button>
      </div>
    </div>
  );
}
