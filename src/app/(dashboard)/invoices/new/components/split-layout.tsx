"use client";

import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import { FormCTABar } from "./form-cta-bar";
import { InvoiceForm } from "./invoice-form";
import { PreviewPlaceholder } from "./preview-placeholder";

interface SplitLayoutProps {
  settings: UserSettingsRecord | null | undefined;
  nextInvoiceNumber: string | undefined;
}

export function SplitLayout({ settings, nextInvoiceNumber }: SplitLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-0 h-full">
      <div
        id="form-column"
        className="overflow-y-auto border-r"
        style={{ maxHeight: "calc(100vh - 4rem - 65px)" }}
      >
        <div className="p-6 pb-4">
          <InvoiceForm settings={settings} nextInvoiceNumber={nextInvoiceNumber} />
        </div>

        <FormCTABar />
      </div>

      <div
        id="preview-column"
        className="hidden md:flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 4rem - 65px)" }}
      >
        <PreviewPlaceholder />
      </div>
    </div>
  );
}
