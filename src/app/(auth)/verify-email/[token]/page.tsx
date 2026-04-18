import type { Metadata } from "next";
import { VerifyEmailClient } from "./components/verify-email-client";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Verify your email address to activate your account.",
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const { token } = await params;

  return <VerifyEmailClient token={token} />;
}
