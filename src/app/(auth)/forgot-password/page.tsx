import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your account password.",
};

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session.userId) {
    redirect("/dashboard");
  }

  return <ForgotPasswordForm />;
}
