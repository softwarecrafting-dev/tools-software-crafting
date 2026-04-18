import { getSession } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyPromptCard } from "./components/verify-prompt-card";

export const metadata: Metadata = {
  title: "Check Your Email",
  description:
    "Verify your email address to activate your SoftwareCrafting Tools account.",
};

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyPromptPage({ searchParams }: PageProps) {
  const session = await getSession();

  if (session.userId) {
    redirect("/dashboard");
  }

  const { email } = await searchParams;
  const displayEmail = email ? decodeURIComponent(email) : null;

  return <VerifyPromptCard email={displayEmail} />;
}
