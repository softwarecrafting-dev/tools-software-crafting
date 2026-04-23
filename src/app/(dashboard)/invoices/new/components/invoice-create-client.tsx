"use client";

import { useNextInvoiceNumber } from "@/hooks/use-next-invoice-number";
import { useSettings } from "@/hooks/use-settings";
import { AnimatePresence, motion } from "motion/react";
import { EditorErrorState } from "./editor-error-state";
import { FormSkeleton } from "./form-placeholder";
import { PageHeader } from "./page-header";
import { SplitLayout } from "./split-layout";

export function InvoiceCreateClient() {
  const settingsQuery = useSettings();
  const nextNumberQuery = useNextInvoiceNumber();

  const isLoading = settingsQuery.isLoading || nextNumberQuery.isLoading;
  const isError = settingsQuery.isError || nextNumberQuery.isError;
  const error = settingsQuery.error ?? nextNumberQuery.error;
  const isRetrying = settingsQuery.isFetching || nextNumberQuery.isFetching;

  const handleRetry = () => {
    if (settingsQuery.isError) void settingsQuery.refetch();
    if (nextNumberQuery.isError) void nextNumberQuery.refetch();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
      <PageHeader />

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
                nextInvoiceNumber={nextNumberQuery.data?.invoiceNumber}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
