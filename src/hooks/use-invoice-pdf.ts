import { apiClient, ApiError } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async ({
      id,
      invoiceNumber,
    }: {
      id: string;
      invoiceNumber: string;
    }) => {
      try {
        const response = await apiClient.get(`/invoices/${id}/pdf`, {
          responseType: "blob",
        });

        const blob = response as unknown as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", `Invoice-${invoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        throw new Error("Failed to download PDF");
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to download invoice PDF");
    },
  });
}
