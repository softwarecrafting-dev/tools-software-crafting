import { apiClient, ApiError } from "@/lib/api-client";
import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import type { SettingsInput } from "@/lib/validators/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],

    queryFn: async () => {
      const res = await apiClient.get<
        unknown,
        { data: UserSettingsRecord | null }
      >("/settings");

      return res.data;
    },

    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["settings", "update"],

    mutationFn: async (payload: Partial<SettingsInput>) => {
      const res = await apiClient.patch<unknown, { data: UserSettingsRecord }>(
        "/settings",
        payload,
      );
      return res.data;
    },

    retry: false,

    onSuccess: (data) => {
      queryClient.setQueryData(["settings"], data);
    },

    onError: (error: unknown) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save settings. Please try again.";

      toast.error(message);
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["settings", "complete-onboarding"],

    mutationFn: async () => {
      await apiClient.patch("/user/onboarding");
    },

    retry: false,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },

    onError: (error: unknown) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to complete setup. Please try again.";

      toast.error(message);
    },
  });
}
