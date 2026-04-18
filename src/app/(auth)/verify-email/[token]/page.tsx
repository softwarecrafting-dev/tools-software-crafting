import { getSession } from "@/lib/auth";
import { findUserById } from "@/lib/db/repositories/user.repo";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { VerifyEmailClient } from "./components/verify-email-client";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Verify your email address to activate your account.",
};

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const session = await getSession();

  if (session.userId) {
    const user = await findUserById(session.userId);
    if (user?.emailVerified) {
      redirect("/dashboard");
    }
  }

  const { token } = await params;

  return <VerifyEmailClient token={token} />;
}
