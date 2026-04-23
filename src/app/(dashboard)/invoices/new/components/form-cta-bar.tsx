"use client";

import { Button } from "@/components/ui/button";
import { FileText, Send } from "lucide-react";

export function FormCTABar() {
  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-3rem)] max-w-2xl px-6 py-4 bg-background/10 backdrop-blur-lg rounded-2xl border shadow-md ">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-medium text-muted-foreground hidden sm:block">
          All changes saved
        </div>

        <div className="flex items-center gap-2">
          <Button id="save-draft-btn-form" variant="outline" className="h-10 ">
            <FileText className="h-4 w-4" />
            Save Draft
          </Button>

          <Button id="send-invoice-btn-form" className="h-10 ">
            <Send className="h-4 w-4 " />
            Send Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}
