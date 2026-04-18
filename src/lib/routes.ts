import { env } from "@/lib/env";

export const routes = {
  auth: {
    verifyEmail: (token: string) => `${env.NEXT_PUBLIC_APP_URL}/verify-email/${token}`,
    resetPassword: (token: string) => `${env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`,
  },
} as const;
