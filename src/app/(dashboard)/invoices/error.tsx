"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function InvoicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Something went wrong!</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          {error.message || "Failed to load invoices. Please try again."}
        </p>
        <Button onClick={() => reset()} variant="outline">
          <RotateCcw className=" h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
