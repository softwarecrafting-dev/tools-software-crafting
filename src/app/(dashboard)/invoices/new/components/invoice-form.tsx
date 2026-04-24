"use client";

import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import { addDays, startOfDay } from "date-fns";
import { motion } from "motion/react";
import { useEffect } from "react";
import {
  useFormContext,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SavingIndicator } from "./saving-indicator";
import { SectionCard } from "./section-card";
import { AttachmentsSection } from "./sections/attachments-section";
import { BillFromSection } from "./sections/bill-from-section";
import { BillToSection } from "./sections/bill-to-section";
import { InvoiceMetaSection } from "./sections/invoice-meta-section";
import { LineItemsSection } from "./sections/line-items-section";
import { NotesTermsSection } from "./sections/notes-terms-section";
import { PaymentDetailsSection } from "./sections/payment-details-section";
import { TotalsSection } from "./sections/totals-section";

const DEFAULT_PAYMENT_TERMS_DAYS = 30;

export type InvoiceFormValues = z.infer<typeof InvoiceBaseSchema>;

function buildDefaultValues(
  settings: UserSettingsRecord | null | undefined,
  nextInvoiceNumber: string | undefined,
): Partial<InvoiceFormValues> {
  const today = startOfDay(new Date());
  const defaultTermsDays =
    Number(settings?.defaultPaymentTerms) || DEFAULT_PAYMENT_TERMS_DAYS;

  return {
    clientName: "",
    clientEmail: "",
    clientCompany: "",
    clientAddress: "",
    clientGstin: "",
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
    terms:
      (settings as UserSettingsRecord & { defaultTerms?: string | null })
        ?.defaultTerms ?? "",
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
  signatureUrl,
  saveDraft,
  isSaving,
  lastSavedAt,
}: {
  isSettingsIncomplete: boolean;
  logoUrl?: string | null;
  signatureUrl?: string | null;
  saveDraft: (
    data: InvoiceFormValues,
    isAutosave?: boolean,
    setValue?: UseFormSetValue<InvoiceFormValues>,
  ) => Promise<string | null | undefined>;
  isSaving: boolean;
  lastSavedAt: Date | null;
}) {
  const { handleSubmit, reset, formState, setValue, getValues, register } =
    useFormContext<InvoiceFormValues>();
  const isDirty = formState.isDirty;

  const onSubmit = (data: InvoiceFormValues) => {
    void saveDraft(data, false, setValue).then((id) => {
      reset({ ...data, id: id ?? data.id });
    });
  };

  const onInvalid = (errors: FieldErrors<InvoiceFormValues>) => {
    console.error("Validation errors:", errors);
    toast.error("Please fix the errors in the form before saving.");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty && !isSaving) {
        handleSubmit((data) => {
          void saveDraft(data, true, setValue).then((id) => {
            reset({ ...data, id: id ?? data.id });
          });
        }, onInvalid)();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isDirty, isSaving, handleSubmit, saveDraft, reset, setValue, getValues]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit((data) => {
          void saveDraft(data, false, setValue).then(() => {
            reset(getValues());
          });
        }, onInvalid)();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSubmit, saveDraft, reset, setValue, getValues]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
      <input type="hidden" {...register("id")} />
      <div className="flex justify-end mb-4 pr-1">
        <SavingIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
      </div>
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
          transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
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
