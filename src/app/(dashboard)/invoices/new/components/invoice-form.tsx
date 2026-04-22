"use client";

import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, startOfDay } from "date-fns";
import { motion } from "motion/react";
import { FormProvider, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import type { z } from "zod";
import { SectionCard } from "./section-card";
import { InvoiceMetaSection } from "./sections/invoice-meta-section";

const DEFAULT_PAYMENT_TERMS_DAYS = 30;

export type InvoiceFormValues = z.output<typeof InvoiceBaseSchema>;
type InvoiceFormInput = z.input<typeof InvoiceBaseSchema>;

function buildDefaultValues(
  settings: UserSettingsRecord | null | undefined,
  nextInvoiceNumber: string | undefined,
): Partial<InvoiceFormValues> {
  const today = startOfDay(new Date());
  const defaultTermsDays =
    Number(settings?.defaultPaymentTerms) || DEFAULT_PAYMENT_TERMS_DAYS;

  return {
    invoiceNumber: nextInvoiceNumber ?? "",
    currency:
      (settings?.defaultCurrency as InvoiceFormValues["currency"]) ?? "INR",
    issueDate: today.toISOString(),
    dueDate: addDays(today, defaultTermsDays).toISOString(),
    paymentTermsDays: defaultTermsDays,
    taxRate: Number(settings?.defaultTaxRate ?? 0),
    taxLabel: "Tax",
    discountType: null,
    discountValue: 0,
    discountAmount: 0,
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    template: "minimal",
    lineItems: [],
    attachments: [],
    sendCcEmails: [],
    notes: settings?.defaultNotes ?? "",
  };
}

interface InvoiceFormProps {
  settings: UserSettingsRecord | null | undefined;
  nextInvoiceNumber: string | undefined;
}

export function InvoiceForm({ settings, nextInvoiceNumber }: InvoiceFormProps) {
  const methods = useForm<InvoiceFormValues, unknown, InvoiceFormValues>({
    resolver: zodResolver(InvoiceBaseSchema) as Resolver<InvoiceFormValues>,
    defaultValues: buildDefaultValues(settings, nextInvoiceNumber) as InvoiceFormInput,
    mode: "onBlur",
  });

  const onSubmit = (data: InvoiceFormValues) => {
    console.log("submit", data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.04, ease: "easeOut" }}
          >
            <SectionCard section={1} title="Invoice Details">
              <InvoiceMetaSection />
            </SectionCard>
          </motion.div>
        </div>
      </form>
    </FormProvider>
  );
}
