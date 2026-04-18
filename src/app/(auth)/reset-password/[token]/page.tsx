import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "./components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your account.",
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const session = await getSession();

  if (session.userId) {
    redirect("/dashboard");
  }

  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}
