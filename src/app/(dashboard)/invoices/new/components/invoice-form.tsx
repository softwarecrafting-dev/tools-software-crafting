"use client";

import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import { motion } from "motion/react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import { addDays, startOfDay } from "date-fns";
import { SectionCard } from "./section-card";
import { BillFromSection } from "./sections/bill-from-section";
import { BillToSection } from "./sections/bill-to-section";
import { InvoiceMetaSection } from "./sections/invoice-meta-section";
import { LineItemsSection } from "./sections/line-items-section";
import { NotesTermsSection } from "./sections/notes-terms-section";
import { AttachmentsSection } from "./sections/attachments-section";
import { PaymentDetailsSection } from "./sections/payment-details-section";
import { TotalsSection } from "./sections/totals-section";

const DEFAULT_PAYMENT_TERMS_DAYS = 30;

export type InvoiceFormValues = z.output<typeof InvoiceBaseSchema>;

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
    lineItems: [
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        quantity: 1,
        unit: "hrs",
        rate: 0,
        amount: 0,
      },
    ],
    attachments: [],
    sendCcEmails: [],
    notes: settings?.defaultNotes ?? "",
    terms: (settings as UserSettingsRecord & { defaultTerms?: string | null })?.defaultTerms ?? "",
    fromName: settings?.businessName ?? "",
    fromEmail: settings?.businessEmail ?? "",
    fromPhone: settings?.businessPhone ?? "",
    fromAddress: settings?.businessAddress ?? "",
    fromGstin: settings?.gstin ?? "",
    fromPan: settings?.pan ?? "",
    bankName: settings?.bankName ?? "",
    accountName: settings?.businessName ?? "",
    accountNumber: settings?.bankAccountNumber ?? "",
    ifscCode: settings?.bankIfsc ?? "",
    upiId: settings?.bankUpiId ?? "",
    swiftBic: settings?.swiftBic ?? "",
    logoUrl: settings?.logoUrl,
    signatureUrl: settings?.signatureUrl,
  };
}

export function InvoiceForm({ 
  isSettingsIncomplete, 
  logoUrl, 
  signatureUrl 
}: { 
  isSettingsIncomplete: boolean; 
  logoUrl?: string | null; 
  signatureUrl?: string | null;
}) {
  const { handleSubmit } = useFormContext<InvoiceFormValues>();

  const onSubmit = (data: InvoiceFormValues) => {
    console.log("Submit invoice form", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="pb-12">
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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08, ease: "easeOut" }}
        >
          <SectionCard section={2} title="Bill From">
            <BillFromSection
              logoUrl={logoUrl}
              signatureUrl={signatureUrl}
              isSettingsIncomplete={isSettingsIncomplete}
            />
          </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.12, ease: "easeOut" }}
        >
          <SectionCard section={3} title="Bill To">
            <BillToSection />
          </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.16, ease: "easeOut" }}
        >
          <SectionCard section={4} title="Line Items">
             <LineItemsSection />
          </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.20, ease: "easeOut" }}
        >
           <SectionCard section={5} title="Summary">
              <TotalsSection />
           </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.24, ease: "easeOut" }}
        >
          <SectionCard section={6} title="Payment Details">
             <PaymentDetailsSection />
          </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.28, ease: "easeOut" }}
        >
           <SectionCard section={7} title="Notes & Terms">
              <NotesTermsSection />
           </SectionCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.32, ease: "easeOut" }}
        >
           <SectionCard section={8} title="Attachments">
              <AttachmentsSection />
           </SectionCard>
        </motion.div>
      </div>
    </form>
  );
}

export { buildDefaultValues };
