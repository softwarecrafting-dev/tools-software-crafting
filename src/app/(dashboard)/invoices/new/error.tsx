"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function InvoiceCreateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    console.error("[InvoiceCreate] boundary caught:", error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] shrink-0 items-center justify-center rounded-xl border border-dashed bg-card/30 backdrop-blur-[2px] m-6">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20 ring-inset">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight">
          Unable to load invoice editor
        </h3>

        <p className="mb-8 mt-2 text-sm text-muted-foreground leading-relaxed">
          {error.message ||
            "We encountered an unexpected issue while loading the invoice editor. This might be a temporary problem."}
        </p>

        <Button
          onClick={handleReset}
          variant="outline"
          disabled={isResetting}
          className="shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          {isResetting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          {isResetting ? "Retrying..." : "Try again"}
        </Button>
      </div>
    </div>
  );
}
