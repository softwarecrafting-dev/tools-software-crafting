"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center animate-in zoom-in-95 duration-300">
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground whitespace-pre-wrap max-w-md mx-auto">
          We encountered an unexpected error while loading your dashboard.
        </p>
      </div>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
