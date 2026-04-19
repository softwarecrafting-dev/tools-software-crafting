import { SafeUser } from "@/lib/db/repositories/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useUser() {
  return useQuery<SafeUser>({
    queryKey: ["user", "me"],

    queryFn: async () => {
      const { data } = await axios.get<{
        success: boolean;
        data: SafeUser;
      }>("/api/user/me");

      if (!data.success) {
        throw new Error("Failed to fetch user");
      }

      return data.data;
    },

    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
