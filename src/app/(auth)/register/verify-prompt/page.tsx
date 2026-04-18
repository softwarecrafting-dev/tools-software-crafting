import type { Metadata } from "next";
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
  const { email } = await searchParams;
  const displayEmail = email ? decodeURIComponent(email) : null;

  return <VerifyPromptCard email={displayEmail} />;
}
