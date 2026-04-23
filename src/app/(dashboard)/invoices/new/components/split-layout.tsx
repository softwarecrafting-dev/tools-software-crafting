"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { FormCTABar } from "./form-cta-bar";
import type { InvoiceFormValues } from "./invoice-form";
import { InvoiceForm, buildDefaultValues } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

interface SplitLayoutProps {
  settings: UserSettingsRecord | null | undefined;
  nextInvoiceNumber: string | undefined;
}

export function SplitLayout({ settings, nextInvoiceNumber }: SplitLayoutProps) {
  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceBaseSchema) as Resolver<InvoiceFormValues>,
    defaultValues: buildDefaultValues(settings, nextInvoiceNumber),
    mode: "onBlur",
  });

  const isSettingsIncomplete =
    !settings?.businessName || !settings?.businessEmail;

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-0 h-full overflow-hidden">
        <div
          id="form-column"
          className="relative flex flex-col  h-full min-h-0"
        >
          <ScrollArea className="h-full">
            <div className="px-4 pb-24">
              <InvoiceForm
                isSettingsIncomplete={isSettingsIncomplete}
                logoUrl={settings?.logoUrl}
                signatureUrl={settings?.signatureUrl}
              />
            </div>
          </ScrollArea>

          <FormCTABar />
        </div>

        <div id="preview-column" className="hidden lg:block  h-full min-h-0">
          <ScrollArea className="h-full">
            <div className="px-4">
              <InvoicePreview />
            </div>
          </ScrollArea>
        </div>
      </div>
    </FormProvider>
  );
}
