"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/auth/logout");

      return response.data;
    },

    onSuccess: () => {
      toast.success("Logged out successfully");

      queryClient.clear();

      router.push("/login");
      router.refresh();
    },
    onError: (error: unknown) => {
      let errorMessage = "Logout failed";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    },
  });
}
