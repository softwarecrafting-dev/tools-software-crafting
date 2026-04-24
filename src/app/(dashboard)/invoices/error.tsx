"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function InvoicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    console.error("[Invoices] boundary caught:", error);
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 600);
  };

  return (
    <div className="flex h-[450px] items-center justify-center p-6">
      <Card className="mx-auto max-w-[420px] w-full text-center border-dashed bg-card/30 backdrop-blur-[2px]">
        <CardHeader className="flex flex-col items-center pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20 ring-inset">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="mt-4 text-xl">
            Unable to load invoices
          </CardTitle>
          <CardDescription className="mt-2 text-balance">
            {error.message ||
              "We encountered an unexpected issue while retrieving your data. This might be a temporary connection problem."}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isResetting}
            className=""
          >
            {isResetting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            {isResetting ? "Retrying..." : "Try again"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
