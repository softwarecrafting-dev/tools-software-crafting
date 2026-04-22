import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";

interface NextInvoiceNumberResponse {
  invoiceNumber: string;
}

export function useNextInvoiceNumber() {
  return useQuery({
    queryKey: ["invoices", "next-number"],

    queryFn: async () => {
      const res = await apiClient.get<unknown, NextInvoiceNumberResponse>(
        "/invoices/next-number",
      );

      return res;
    },

    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
