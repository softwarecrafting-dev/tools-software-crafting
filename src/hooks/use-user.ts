import { apiClient } from "@/lib/api-client";
import { SafeUser } from "@/lib/db/repositories/types";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery<SafeUser>({
    queryKey: ["user", "me"],

    queryFn: async () => {
      const res = await apiClient.get<unknown, { data: SafeUser }>("/user/me");

      return res.data;
    },

    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
