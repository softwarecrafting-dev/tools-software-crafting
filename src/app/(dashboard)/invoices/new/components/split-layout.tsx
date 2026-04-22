"use client";

import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import { FormCTABar } from "./form-cta-bar";
import { InvoiceForm, buildDefaultValues } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import type { InvoiceFormValues } from "./invoice-form";
import type { Resolver } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const isSettingsIncomplete = !settings?.businessName || !settings?.businessEmail;

  return (
    <FormProvider {...methods}>
      <div className="grid grid-cols-1 lg:grid-cols-[60fr_40fr] gap-0 h-full border-t">
        <div
          id="form-column"
          className="overflow-y-auto border-r bg-muted/5"
          style={{ maxHeight: "calc(100vh - 4rem - 65px)" }}
        >
          <div className="p-6 pb-24">
            <InvoiceForm 
              isSettingsIncomplete={isSettingsIncomplete}
              logoUrl={settings?.logoUrl}
              signatureUrl={settings?.signatureUrl}
            />
          </div>

          <FormCTABar />
        </div>

        <div
          id="preview-column"
          className="hidden lg:block bg-muted/20"
          style={{ maxHeight: "calc(100vh - 4rem - 65px)" }}
        >
          <ScrollArea className="h-full">
            <div className="p-8">
              <InvoicePreview />
            </div>
          </ScrollArea>
        </div>
      </div>
    </FormProvider>
  );
}
