"use client";

import { Field, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Banknote, Percent } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { InvoiceFormValues } from "../invoice-form";

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SGD: "S$",
};

export function TotalsSection() {
  const { register, control, setValue } = useFormContext<InvoiceFormValues>();

  const lineItems = useWatch({ control, name: "lineItems" });
  const discountType = useWatch({ control, name: "discountType" });
  const discountValue = useWatch({ control, name: "discountValue" });
  const taxRate = useWatch({ control, name: "taxRate" });
  const taxLabel = useWatch({ control, name: "taxLabel" });
  const currency = useWatch({ control, name: "currency" });

  const stats = useMemo(() => {
    const subtotal =
      lineItems?.reduce((acc, item) => acc + (Number(item.amount) || 0), 0) ||
      0;

    let discountAmount = 0;
    if (discountType === "percentage") {
      discountAmount = subtotal * ((Number(discountValue) || 0) / 100);
    } else if (discountType === "fixed") {
      discountAmount = Number(discountValue) || 0;
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = taxableAmount * ((Number(taxRate) || 0) / 100);
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      total,
    };
  }, [lineItems, discountType, discountValue, taxRate]);

  useEffect(() => {
    setValue("subtotal", stats.subtotal);
    setValue("discountAmount", stats.discountAmount);
    setValue("taxAmount", stats.taxAmount);
    setValue("total", stats.total);
  }, [stats, setValue]);

  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

  const formatValue = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="grid grid-cols-1  space-y-3 items-start">
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldTitle className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
              Discount Type
            </FieldTitle>

            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={discountType || ""}
              onValueChange={(val) => {
                setValue(
                  "discountType",
                  (val as InvoiceFormValues["discountType"]) || null,
                  { shouldValidate: true },
                );
              }}
              className="justify-start"
            >
              <ToggleGroupItem value="percentage" className="px-3 gap-2">
                <Percent className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Percentage</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="fixed" className="px-3 gap-2">
                <Banknote className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Fixed Amount</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <AnimatePresence mode="wait">
            {discountType && (
              <motion.div
                key={discountType}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Field>
                  <FieldTitle className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    {discountType === "percentage"
                      ? "Discount (%)"
                      : `Discount (${symbol})`}
                  </FieldTitle>

                  <NumberInput
                    value={discountValue}
                    onChange={(val) =>
                      setValue("discountValue", val, { shouldValidate: true })
                    }
                    minValue={0}
                    maxValue={discountType === "percentage" ? 100 : undefined}
                    step={discountType === "percentage" ? 1 : 0.01}
                  />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldTitle className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
              Tax Label
            </FieldTitle>
            <Input
              placeholder="GST, VAT, etc."
              className="h-10"
              {...register("taxLabel")}
            />
          </Field>

          <Field>
            <FieldTitle className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
              Tax Rate (%)
            </FieldTitle>
            <NumberInput
              value={taxRate}
              onChange={(val) =>
                setValue("taxRate", val, { shouldValidate: true })
              }
              minValue={0}
              maxValue={100}
              step={0.1}
            />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border bg-muted/30 p-6 space-y-4 shadow-sm backdrop-blur-sm">
        <div className="space-y-3 pb-4 border-b border-dashed border-border/60">
          <div className="flex items-center justify-between group">
            <span className="text-sm font-medium text-muted-foreground">
              Subtotal
            </span>
            <span className="text-sm font-bold tabular-nums">
              {symbol}
              {formatValue(stats.subtotal)}
            </span>
          </div>

          <AnimatePresence>
            {stats.discountAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 overflow-hidden"
              >
                <span className="text-sm font-medium">Discount</span>
                <span className="text-sm font-bold tabular-nums">
                  -{symbol}
                  {formatValue(stats.discountAmount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stats.taxAmount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between overflow-hidden"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  {taxLabel || "Tax"} ({taxRate}%)
                </span>
                <span className="text-sm font-bold tabular-nums">
                  {symbol}
                  {formatValue(stats.taxAmount)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <span className="text-base font-bold tracking-tight">
              Grand Total
            </span>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              Amount Due
            </p>
          </div>
          <div className="text-right">
            <motion.div
              key={stats.total}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black tracking-tighter text-primary tabular-nums"
            >
              {symbol}
              {formatValue(stats.total)}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
