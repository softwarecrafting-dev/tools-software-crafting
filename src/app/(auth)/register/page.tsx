import type { Metadata } from "next";
import { RegisterForm } from "./components/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Create a free SoftwareCrafting Tools account to manage invoices, documents, and more.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
