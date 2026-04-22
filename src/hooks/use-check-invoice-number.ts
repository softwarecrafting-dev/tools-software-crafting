import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface CheckNumberResponse {
  exists: boolean;
}

export function useCheckInvoiceNumber(invoiceNumber: string, enabled: boolean) {
  return useQuery({
    queryKey: ["invoices", "check-number", invoiceNumber],

    queryFn: async () => {
      const res = await apiClient.get<unknown, CheckNumberResponse>(
        "/invoices/check-number",
        { params: { invoiceNumber } },
      );

      return res;
    },

    enabled: enabled && invoiceNumber.trim().length > 0,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
