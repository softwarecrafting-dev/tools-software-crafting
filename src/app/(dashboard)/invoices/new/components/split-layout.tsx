"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import type { InvoiceFormValues } from "./invoice-form";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

interface SplitLayoutProps {
  settings: UserSettingsRecord | null | undefined;
  saveDraft: (data: InvoiceFormValues, isAutosave?: boolean) => Promise<void>;
  isSaving: boolean;
  lastSavedAt: Date | null;
}

export function SplitLayout({
  settings,
  saveDraft,
  isSaving,
  lastSavedAt,
}: SplitLayoutProps) {
  const isSettingsIncomplete =
    !settings?.businessName || !settings?.businessEmail;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-0 h-full overflow-hidden">
      <div id="form-column" className="relative flex flex-col  h-full min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 pb-24">
            <InvoiceForm
              isSettingsIncomplete={isSettingsIncomplete}
              logoUrl={settings?.logoUrl}
              signatureUrl={settings?.signatureUrl}
              saveDraft={saveDraft}
              isSaving={isSaving}
            />
          </div>
        </ScrollArea>

        {/* <FormCTABar saveDraft={saveDraft} isSaving={isSaving} lastSavedAt={lastSavedAt} /> */}
      </div>

      <div id="preview-column" className="hidden lg:block  h-full min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4">
            <InvoicePreview />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
