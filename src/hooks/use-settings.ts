import type { UserSettingsRecord } from "@/lib/db/repositories/types";
import type { SettingsInput } from "@/lib/validators/settings";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await axios.get<{
        success: boolean;
        data: UserSettingsRecord | null;
      }>("/api/settings");

      return data.data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<SettingsInput>) => {
      const { data } = await axios.patch<{
        success: boolean;
        data: UserSettingsRecord;
      }>("/api/settings", payload);

      return data.data;
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
      const { data } = await axios.patch<{ success: boolean; message: string }>(
        "/api/user/onboarding",
      );
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
