"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";
import {
  FloatingInput,
  FloatingTextarea,
} from "@/components/ui/floating-label";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, TriangleAlertIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { InvoiceFormValues } from "./invoice-form";

const UNIT_OPTIONS = [
  { value: "hrs", label: "hrs" },
  { value: "days", label: "days" },
  { value: "pages", label: "pages" },
  { value: "words", label: "words" },
  { value: "units", label: "units" },
  { value: "fixed", label: "fixed" },
  { value: "months", label: "months" },
] as const;

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "د.إ",
  SGD: "S$",
};

interface LineItemRowProps {
  index: number;
  id: string;
  canDelete: boolean;
  onDelete: (index: number) => void;
}

export function LineItemRow({
  index,
  id,
  canDelete,
  onDelete,
}: LineItemRowProps) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [unitOpen, setUnitOpen] = useState(false);

  const qty = useWatch<InvoiceFormValues>({
    name: `lineItems.${index}.quantity`,
  }) as number;
  const rate = useWatch<InvoiceFormValues>({
    name: `lineItems.${index}.rate`,
  }) as number;
  const currency = useWatch<InvoiceFormValues, "currency">({
    name: "currency",
  });
  const unit = useWatch<InvoiceFormValues>({
    name: `lineItems.${index}.unit`,
  }) as string;

  const itemName = useWatch<InvoiceFormValues>({
    name: `lineItems.${index}.name`,
  }) as string;

  const amount = (Number(qty) || 0) * (Number(rate) || 0);
  const currencySymbol = CURRENCY_SYMBOLS[currency] ?? currency;

  useEffect(() => {
    setValue(`lineItems.${index}.amount`, amount);
  }, [amount, setValue, index]);

  const itemErrors = (
    errors.lineItems as
      | Record<number, Record<string, { message?: string }>>
      | undefined
  )?.[index];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-200 ${
        isDragging
          ? "shadow-2xl ring-2 ring-primary/20 z-50 scale-[1.02] border-primary/20 bg-background"
          : "hover:border-border/80 hover:shadow-md"
      }`}
    >
      <div className="flex items-stretch gap-2 p-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex h-10 w-6 items-center justify-center shrink-0 cursor-grab touch-none text-muted-foreground/30 hover:text-muted-foreground transition-colors active:cursor-grabbing"
          tabIndex={-1}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0 flex flex-col ">
          <div className="grid grid-cols-1  gap-2 items-start">
            <Field data-invalid={!!itemErrors?.name}>
              <FloatingInput
                label="Item Name"
                {...register(`lineItems.${index}.name`)}
              />
              <FieldError errors={[itemErrors?.name as { message?: string }]} />
            </Field>

            <Field className="md:row-span-2">
              <FloatingTextarea
                label="Description"
                className="max-h-16 overflow-y-auto"
                {...register(`lineItems.${index}.description`)}
              />
              <FieldError
                errors={[itemErrors?.description as { message?: string }]}
              />
            </Field>

            <div className="grid grid-cols-4 gap-2 items-start">
              <Field data-invalid={!!itemErrors?.quantity}>
                <Controller
                  control={control}
                  name={`lineItems.${index}.quantity`}
                  render={({ field }) => (
                    <NumberInput
                      aria-label="Quantity"
                      value={field.value}
                      onChange={field.onChange}
                      textCenter
                    />
                  )}
                />
              </Field>

              <Field>
                <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="h-10 w-full rounded-lg border border-input  px-2 text-sm text-center font-medium transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 truncate"
                    >
                      {unit || "unit"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-32 p-0" align="start">
                    <ScrollArea className="h-48">
                      <div className="p-1">
                        {UNIT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setValue(`lineItems.${index}.unit`, opt.value, {
                                shouldValidate: true,
                              });
                              setUnitOpen(false);
                            }}
                            className={`flex w-full items-center rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none ${
                              unit === opt.value
                                ? "bg-primary/5 font-semibold text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </Field>

              <Field data-invalid={!!itemErrors?.rate}>
                <Controller
                  control={control}
                  name={`lineItems.${index}.rate`}
                  render={({ field }) => (
                    <NumberInput
                      aria-label="Rate"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>

              <Field>
                <div className="flex h-10 items-center justify-end rounded-lg bg-primary/5 dark:bg-primary/10 px-3 text-sm font-bold text-primary tabular-nums border border-primary/10">
                  {currencySymbol}
                  {amount.toFixed(2)}
                </div>
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border/50 pt-2 pb-1">
            <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground/60">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Line Item {index + 1}
              </div>
              {unit && (
                <div className="uppercase tracking-tighter">
                  Billed per {unit}
                </div>
              )}
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="h-7 px-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all disabled:opacity-20 flex items-center"
                  variant={"ghost"}
                  disabled={!canDelete}
                >
                  <Trash2 className="h-3 w-3 " />
                  Remove Item
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="">
                <AlertDialogHeader className="place-items-center! items-center">
                  <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
                    <TriangleAlertIcon className="text-destructive size-6" />
                  </div>

                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete?
                  </AlertDialogTitle>

                  <AlertDialogDescription className="text-center space-y-4">
                    This action cannot be undone. This will permanently remove{" "}
                    <span className="font-bold text-foreground underline decoration-destructive/30 underline-offset-4">
                      &quot;{itemName || "Untitled Item"}&quot;
                    </span>{" "}
                    and its associated rate/quantity from your invoice.
                    <span className="mt-4 flex items-center justify-center gap-2">
                      <Checkbox id="terms" />
                      <Label
                        htmlFor="terms"
                        className="text-xs font-medium cursor-pointer"
                      >
                        Don&apos;t ask next again
                      </Label>
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="">
                  <AlertDialogCancel className="">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => onDelete(index)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
