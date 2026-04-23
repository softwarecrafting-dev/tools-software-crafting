"use client";

import { useNextInvoiceNumber } from "@/hooks/use-next-invoice-number";
import { useSettings } from "@/hooks/use-settings";
import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { useInvoiceLifecycle } from "../hooks/use-invoice-lifecycle";
import { EditorErrorState } from "./editor-error-state";
import { FormSkeleton } from "./form-placeholder";
import { buildDefaultValues, type InvoiceFormValues } from "./invoice-form";
import { PageHeader } from "./page-header";
import { SplitLayout } from "./split-layout";

export function InvoiceCreateClient() {
  const settingsQuery = useSettings();
  const nextNumberQuery = useNextInvoiceNumber();
  const { isSaving, lastSavedAt, saveDraft } = useInvoiceLifecycle();

  const isLoading = settingsQuery.isLoading || nextNumberQuery.isLoading;
  const isError = settingsQuery.isError || nextNumberQuery.isError;
  const error = settingsQuery.error ?? nextNumberQuery.error;
  const isRetrying = settingsQuery.isFetching || nextNumberQuery.isFetching;

  const handleRetry = () => {
    if (settingsQuery.isError) void settingsQuery.refetch();
    if (nextNumberQuery.isError) void nextNumberQuery.refetch();
  };

  const defaultValues = useMemo(
    () =>
      buildDefaultValues(
        settingsQuery.data,
        nextNumberQuery.data?.invoiceNumber,
      ),
    [settingsQuery.data, nextNumberQuery.data?.invoiceNumber],
  );

  const methods = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceBaseSchema) as Resolver<InvoiceFormValues>,
    defaultValues: defaultValues,
    mode: "onBlur",
  });

  useEffect(() => {
    if (!isLoading && !isError && defaultValues) {
      methods.reset(defaultValues, { keepDirtyValues: true });
    }
  }, [isLoading, isError, defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
        <PageHeader
          isSaving={isSaving}
          lastSavedAt={lastSavedAt}
          saveDraft={saveDraft}
        />

        <div className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FormSkeleton />
              </motion.div>
            ) : isError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                <EditorErrorState
                  error={error}
                  onRetry={handleRetry}
                  isRetrying={isRetrying}
                />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full"
              >
                <SplitLayout
                  settings={settingsQuery.data}
                  saveDraft={saveDraft}
                  isSaving={isSaving}
                  lastSavedAt={lastSavedAt}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FormProvider>
  );
}
