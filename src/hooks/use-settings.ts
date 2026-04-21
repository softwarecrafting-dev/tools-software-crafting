import { apiClient } from "@/lib/api-client";
import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import type { SettingsInput } from "@/lib/validators/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    retry: 1,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<SettingsInput>) => {
      const res = await apiClient.patch<unknown, { data: UserSettingsRecord }>(
        "/settings",
        payload,
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.patch("/user/onboarding");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
