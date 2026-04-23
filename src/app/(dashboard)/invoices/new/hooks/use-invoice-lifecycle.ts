import { useCreateInvoice, useUpdateInvoice } from "@/hooks/use-invoices";
import { InvoiceBaseSchema } from "@/lib/validators/invoice";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";

type InvoiceFormValues = z.infer<typeof InvoiceBaseSchema>;

export function useInvoiceLifecycle() {
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const saveDraft = useCallback(
    async (data: InvoiceFormValues, isAutosave = false) => {
      try {
        if (invoiceId) {
          await updateMutation.mutateAsync({ id: invoiceId, payload: data });

          setLastSavedAt(new Date());

          if (!isAutosave) toast.success("Draft updated successfully");
        } else {
          const result = await createMutation.mutateAsync(data);

          setInvoiceId(result.id);
          setLastSavedAt(new Date());

          if (!isAutosave) {
            toast.success("Draft saved successfully");
            // router.replace(`/invoices/${result.id}/edit`, { scroll: false });
          }
        }
      } catch (error) {
        if (!isAutosave) {
          toast.error("Failed to save draft");
        }

        console.error("Save error:", error);
      }
    },
    [invoiceId, createMutation, updateMutation],
  );

  return {
    invoiceId,
    saveDraft,
    isSaving,
    lastSavedAt,
    setInvoiceId,
  };
}
