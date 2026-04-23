import { apiClient, ApiError } from "@/lib/api-client";
import type { InvoiceRecord } from "@/lib/db/repositories/types";
import type {
  InvoiceCreateInput,
  InvoiceFiltersQuery,
  InvoiceUpdateInput,
} from "@/lib/validators/invoice";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export interface InvoicesResponse {
  success: boolean;
  data: {
    items: InvoiceRecord[];
    nextCursor: string | null;
  };
}

export interface InvoiceResponse {
  success: boolean;
  data: InvoiceRecord;
}

export function useInvoices(filters: InvoiceFiltersQuery) {
  return useInfiniteQuery({
    queryKey: ["invoices", filters],

    queryFn: async ({ pageParam }) => {
      return apiClient.get<unknown, InvoicesResponse>("/invoices", {
        params: {
          ...filters,
          cursor: pageParam,
        },
      });
    },

    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
    placeholderData: (previousData) => previousData,

    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useInvoice(id: string | null) {
  return useQuery({
    queryKey: ["invoice", id],

    queryFn: async () => {
      if (!id) return null;

      const resp = await apiClient.get<unknown, InvoiceResponse>(
        `/invoices/${id}`,
      );

      return resp.data;
    },

    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: InvoiceCreateInput) => {
      const resp = await apiClient.post<InvoiceCreateInput, InvoiceResponse>(
        "/invoices",
        payload,
      );

      return resp.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },

    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Failed to create invoice";

      toast.error(message);
      console.error("Create invoice error:", error);
    },

    retry: false,
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: InvoiceUpdateInput;
    }) => {
      const resp = await apiClient.patch<InvoiceUpdateInput, InvoiceResponse>(
        `/invoices/${id}`,
        payload,
      );

      return resp.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", data.id] });
    },

    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Failed to update invoice";

      toast.error(message);
      console.error("Update invoice error:", error);
    },

    retry: false,
  });
}
