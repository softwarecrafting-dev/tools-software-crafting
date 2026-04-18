import { DashboardStats } from "@/lib/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],

    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/stats");

      return data.data;
    },
  });
}
