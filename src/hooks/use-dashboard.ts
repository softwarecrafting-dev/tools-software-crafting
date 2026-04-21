import { apiClient } from "@/lib/api-client";
import { DashboardStats } from "@/lib/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],

    queryFn: async () => {
      const res = await apiClient.get<unknown, { data: DashboardStats }>(
        "/dashboard/stats",
      );
      return res.data;
    },

    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
