"use client";

import { apiClient, ApiError } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout");
    },

    retry: false,

    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },

    onError: (error: unknown) => {
      const message =
        error instanceof ApiError ? error.message : "Logout failed";

      toast.error(message);
    },
  });
}
