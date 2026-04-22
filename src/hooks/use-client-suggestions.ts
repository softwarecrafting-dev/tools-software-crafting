import { apiClient } from "@/lib/api-client";
import type { ClientSuggestion } from "@/lib/services/invoice.service";
import { useQuery } from "@tanstack/react-query";

interface SuggestionsResponse {
  data: ClientSuggestion[];
}

export function useClientSuggestions(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["clients", "suggestions", query],

    queryFn: async () => {
      const res = await apiClient.get<unknown, SuggestionsResponse>(
        "/clients/suggestions",
        { params: { q: query } },
      );

      return res.data;
    },

    enabled: enabled && query.trim().length > 0,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
