import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "./components/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a free SoftwareCrafting Tools account to manage invoices, documents, and more.",
};

export default async function RegisterPage() {
  const session = await getSession();
  if (session.userId) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
}
