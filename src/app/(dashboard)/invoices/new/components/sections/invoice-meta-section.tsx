"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCheckInvoiceNumber } from "@/hooks/use-check-invoice-number";
import { addDays } from "date-fns";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { InvoiceFormValues } from "../invoice-form";

const PAYMENT_TERMS = [
  { label: "Net 7", value: "7" },
  { label: "Net 14", value: "14" },
  { label: "Net 30", value: "30" },
  { label: "Net 45", value: "45" },
  { label: "Net 60", value: "60" },
  { label: "Due on Receipt", value: "0" },
  { label: "Custom", value: "custom" },
];

const CURRENCIES = [
  { label: "🇮🇳 INR", value: "INR" },
  { label: "🇺🇸 USD", value: "USD" },
  { label: "🇪🇺 EUR", value: "EUR" },
  { label: "🇬🇧 GBP", value: "GBP" },
  { label: "🇦🇪 AED", value: "AED" },
  { label: "🇸🇬 SGD", value: "SGD" },
];

export function InvoiceMetaSection() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const invoiceNumber = useWatch<InvoiceFormValues, "invoiceNumber">({
    name: "invoiceNumber",
  });
  const issueDate = useWatch<InvoiceFormValues, "issueDate">({
    name: "issueDate",
  });
  const dueDate = useWatch<InvoiceFormValues, "dueDate">({ name: "dueDate" });
  const paymentTerms = useWatch<InvoiceFormValues, "paymentTermsDays">({
    name: "paymentTermsDays",
  });

  const [checkEnabled, setCheckEnabled] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  const { data: numberCheck, isFetching: isCheckingNumber } =
    useCheckInvoiceNumber(invoiceNumber ?? "", checkEnabled);

  const handleInvoiceNumberBlur = useCallback(() => {
    if ((invoiceNumber ?? "").trim().length > 0) {
      setCheckEnabled(true);
    }
  }, [invoiceNumber]);

  const handlePaymentTermsChange = useCallback(
    (val: string) => {
      if (val === "custom") {
        setValue("paymentTermsDays", null);
        return;
      }
      const days = parseInt(val, 10);
      setValue("paymentTermsDays", days);
      const base = getValues("issueDate");
      if (base) {
        setValue("dueDate", addDays(base, days).toISOString());
      }
    },
    [setValue, getValues],
  );

  const handleIssueDateChange = useCallback(
    (date: Date | undefined) => {
      const iso = date?.toISOString() ?? "";
      setValue("issueDate", iso, { shouldValidate: true });
      const terms = getValues("paymentTermsDays");
      if (date && typeof terms === "number") {
        setValue("dueDate", addDays(date, terms).toISOString());
      }
    },
    [setValue, getValues],
  );

  const handleDueDateChange = useCallback(
    (date: Date | undefined) => {
      setValue("dueDate", date?.toISOString() ?? "", { shouldValidate: true });
      setValue("paymentTermsDays", null);
    },
    [setValue],
  );

  const handleCurrencyChange = useCallback(
    (val: string) => {
      const items = getValues("lineItems");
      if (items && items.length > 0 && items.some((i) => i.amount > 0)) {
        toast.warning("Currency changed", {
          description: "Amounts may need review after currency change.",
        });
      }
      setValue("currency", val as InvoiceFormValues["currency"]);
    },
    [setValue, getValues],
  );

  const isNumberTaken =
    checkEnabled && !isCheckingNumber && numberCheck?.exists === true;

  const issueDateObj = issueDate ? new Date(issueDate) : undefined;
  const dueDateObj = dueDate ? new Date(dueDate) : undefined;

  const resolvedTermsValue = (() => {
    if (paymentTerms === null || paymentTerms === undefined) return "custom";
    return String(paymentTerms);
  })();

  const resolvedTermsLabel = PAYMENT_TERMS.find(
    (t) => t.value === resolvedTermsValue,
  )?.label;

  const resolvedCurrencyLabel = CURRENCIES.find(
    (c) => c.value === getValues("currency"),
  )?.label;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field data-invalid={!!errors.invoiceNumber || isNumberTaken}>
        <FieldTitle>
          Invoice Number
          {isCheckingNumber && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-1" />
          )}
        </FieldTitle>
        <Input
          id="invoice-number"
          placeholder="INV-0001"
          {...register("invoiceNumber")}
          onBlur={handleInvoiceNumberBlur}
          aria-invalid={!!errors.invoiceNumber || isNumberTaken}
          className="font-mono h-10"
        />
        <FieldError errors={[errors.invoiceNumber]} />
        {isNumberTaken && (
          <FieldError>This invoice number is already taken.</FieldError>
        )}
      </Field>

      <Field>
        <FieldTitle>Payment Terms</FieldTitle>
        <Popover open={openTerms} onOpenChange={setOpenTerms}>
          <PopoverTrigger asChild>
            <Button
              id="payment-terms"
              variant="outline"
              className="w-full justify-between font-normal h-10 px-3"
            >
              <span className="truncate">
                {resolvedTermsLabel || "Select terms"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" p-0" align="start">
            <ScrollArea className="h-48">
              <div className="p-1">
                {PAYMENT_TERMS.map((t) => (
                  <Button
                    key={t.value}
                    variant="ghost"
                    className="w-full justify-between font-normal h-9 px-2 text-sm"
                    onClick={() => {
                      handlePaymentTermsChange(t.value);
                      setOpenTerms(false);
                    }}
                  >
                    {t.label}
                    {resolvedTermsValue === t.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </Field>

      <Field data-invalid={!!errors.issueDate}>
        <FieldTitle>Issue Date</FieldTitle>
        <DatePicker
          id="issue-date"
          value={issueDateObj}
          onChange={handleIssueDateChange}
          placeholder="Select issue date"
        />
        <FieldError errors={[errors.issueDate as { message?: string }]} />
      </Field>

      <Field data-invalid={!!errors.dueDate}>
        <FieldTitle>Due Date</FieldTitle>
        <DatePicker
          id="due-date"
          value={dueDateObj}
          onChange={handleDueDateChange}
          placeholder="Select due date"
          fromDate={issueDateObj}
        />
        <FieldError errors={[errors.dueDate as { message?: string }]} />
      </Field>

      <Field data-invalid={!!errors.currency}>
        <FieldTitle>Currency</FieldTitle>
        <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
          <PopoverTrigger asChild>
            <Button
              id="currency"
              variant="outline"
              className="w-full justify-between font-normal h-10 px-3"
            >
              <span className="truncate">
                {resolvedCurrencyLabel || "Select currency"}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <ScrollArea className="h-48">
              <div className="p-1">
                {CURRENCIES.map((c) => (
                  <Button
                    key={c.value}
                    variant="ghost"
                    className="w-full justify-between font-normal h-9 px-2 text-sm"
                    onClick={() => {
                      handleCurrencyChange(c.value);
                      setOpenCurrency(false);
                    }}
                  >
                    {c.label}
                    {getValues("currency") === c.value && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <FieldError errors={[errors.currency as { message?: string }]} />
      </Field>

      <Field>
        <FieldTitle>PO Number</FieldTitle>
        <Input
          id="po-number"
          placeholder="Optional"
          className="h-10"
          {...register("poNumber")}
        />
      </Field>
    </div>
  );
}
