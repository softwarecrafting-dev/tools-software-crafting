import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./components/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account.",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session.userId) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
