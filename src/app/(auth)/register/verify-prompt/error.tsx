"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function VerifyPromptError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Verify Prompt Error:", error);
  }, [error]);

  return (
    <div className="w-full max-w-lg">
      <div className="rounded-xl border border-border/60 bg-card shadow-lg p-8 text-center space-y-6">
        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Failed to load</h1>
          <p className="text-muted-foreground text-sm">
            We couldn&apos;t load the verification prompt details.
          </p>
        </div>

        <Alert variant="destructive" className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription className="text-xs break-all">
            {error.message || "An unknown error occurred."}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            Try again
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
