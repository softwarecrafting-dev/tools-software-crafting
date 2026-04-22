"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useClientSuggestions } from "@/hooks/use-client-suggestions";
import type { ApiError } from "@/lib/api-client";
import type { ClientSuggestion } from "@/lib/services/invoice.service";
import { Loader2, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { InvoiceFormValues } from "../invoice-form";

export function BillToSection() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const currency = useWatch<InvoiceFormValues, "currency">({
    name: "currency",
  });
  const clientName = useWatch<InvoiceFormValues, "clientName">({
    name: "clientName",
  });
  const showGstin = currency === "INR";

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(getValues("clientName") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: suggestions = [],
    isFetching,
    error: apiError,
  } = useClientSuggestions(inputValue, inputValue.trim().length > 0);

  const handleSelect = useCallback(
    (suggestion: ClientSuggestion) => {
      setValue("clientName", suggestion.clientName, { shouldValidate: true });
      setValue("clientEmail", suggestion.clientEmail, { shouldValidate: true });
      setValue("clientCompany", suggestion.clientCompany ?? "");
      setValue("clientAddress", suggestion.clientAddress ?? "");
      setValue("clientGstin", suggestion.clientGstin ?? "");
      setInputValue(suggestion.clientName);
      setOpen(false);
      inputRef.current?.blur();
    },
    [setValue],
  );

  const handleClear = useCallback(() => {
    setValue("clientName", "");
    setValue("clientEmail", "");
    setValue("clientCompany", "");
    setValue("clientAddress", "");
    setValue("clientGstin", "");
    setInputValue("");
    setOpen(false);
    inputRef.current?.focus();
  }, [setValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      setValue("clientName", val, { shouldValidate: true });
      if (val.trim().length > 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    },
    [setValue],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field
        data-invalid={!!errors.clientName || !!apiError}
        className="sm:col-span-2"
      >
        <FieldTitle>Client Name</FieldTitle>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={inputRef}
                id="client-name"
                placeholder="Search or enter client name…"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                  if (inputValue.trim().length > 0) setOpen(true);
                }}
                aria-invalid={!!errors.clientName || !!apiError}
                className="h-10 pr-8"
                autoComplete="off"
              />

              {isFetching && (
                <Loader2 className="absolute right-8 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}

              {clientName && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 "
                  onMouseDown={handleClear}
                  tabIndex={-1}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            className=" p-0"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            {isFetching && suggestions.length === 0 ? (
              <div className="flex items-center justify-center gap-2 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching…
              </div>
            ) : !isFetching && suggestions.length === 0 ? (
              <p className="p-3 text-center text-sm text-muted-foreground">
                No clients found.
              </p>
            ) : (
              <ScrollArea className="h-60">
                <div className="p-1">
                  {suggestions.map((s) => (
                    <button
                      key={`${s.clientName}-${s.clientEmail}`}
                      type="button"
                      onClick={() => handleSelect(s)}
                      className="flex w-full flex-col items-start gap-0.5 rounded-sm px-2 py-2 text-left text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                    >
                      <span className="font-medium">{s.clientName}</span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        {s.clientEmail}
                        {s.clientCompany && ` · ${s.clientCompany}`}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </PopoverContent>
        </Popover>

        <FieldError errors={[errors.clientName as { message?: string }]} />

        {apiError && <FieldError>{(apiError as ApiError).message}</FieldError>}
      </Field>

      <Field data-invalid={!!errors.clientEmail}>
        <FieldTitle>Client Email</FieldTitle>

        <Input
          id="client-email"
          type="email"
          placeholder="client@example.com"
          className="h-10"
          {...register("clientEmail")}
          aria-invalid={!!errors.clientEmail}
        />

        <FieldError errors={[errors.clientEmail as { message?: string }]} />
      </Field>

      <Field>
        <FieldTitle>Company</FieldTitle>

        <Input
          id="client-company"
          placeholder="Optional"
          className="h-10"
          {...register("clientCompany")}
        />
      </Field>

      <Field className="sm:col-span-2">
        <FieldTitle>Billing Address</FieldTitle>

        <ScrollArea className="h-12 rounded-lg border bg-background shadow-sm ring-offset-background focus-within:ring-ring/50 focus-within:ring-[3px] transition-all">
          <Textarea
            id="client-address"
            placeholder="Street, City, State, PIN"
            className="min-h-full resize-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            {...register("clientAddress")}
          />
        </ScrollArea>
      </Field>

      {showGstin && (
        <Field>
          <FieldTitle>Client GSTIN</FieldTitle>

          <Input
            id="client-gstin"
            placeholder="22AAAAA0000A1Z5"
            className="h-10 font-mono uppercase"
            {...register("clientGstin")}
          />
        </Field>
      )}
    </div>
  );
}
