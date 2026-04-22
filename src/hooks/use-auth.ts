"use client";

import { apiClient, ApiError } from "@/lib/api-client";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "@/lib/validators/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  return useMutation({
    mutationKey: ["auth", "login"],

    mutationFn: async (data: LoginInput) => {
      await apiClient.post("/auth/login", data);
    },

    retry: false,
  });
}

export function useRegister() {
  return useMutation({
    mutationKey: ["auth", "register"],

    mutationFn: async (data: RegisterInput) => {
      await apiClient.post("/auth/register", data);

      return data;
    },

    retry: false,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],

    mutationFn: async (data: ForgotPasswordInput) => {
      await apiClient.post("/auth/forgot-password", data);
    },

    retry: false,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationKey: ["auth", "reset-password"],

    mutationFn: async (data: ResetPasswordInput & { token: string }) => {
      await apiClient.post("/auth/reset-password", data);
    },

    retry: false,
  });
}

export function useResendVerification() {
  return useMutation({
    mutationKey: ["auth", "resend-verification"],

    mutationFn: async (email: string) => {
      await apiClient.post("/auth/resend-verification", { email });
    },

    retry: false,
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["auth", "logout"],

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
