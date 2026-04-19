import { apiClient } from "@/lib/api-client";
import type { InvoiceRecord } from "@/lib/db/repositories/types";
import type { InvoiceFiltersQuery } from "@/lib/validators/invoice";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface InvoicesResponse {
  success: boolean;
  data: {
    items: InvoiceRecord[];
    nextCursor: string | null;
  };
}

export function useInvoices(filters: InvoiceFiltersQuery) {
  return useInfiniteQuery({
    queryKey: ["invoices", filters],

    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.get<unknown, InvoicesResponse>(
        "/invoices",
        {
          params: {
            ...filters,
            cursor: pageParam,
          },
        },
      );

      return data;
    },

    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: (previousData) => previousData,
  });
}
