"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Onboarding Error:", error);
  }, [error]);

  return (
    <Card className="shadow-lg border-border/60">
      <CardHeader className="text-center space-y-1">
        <div className="mb-4 rounded-full mx-auto bg-destructive/10 p-3 w-fit">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Something went wrong
        </CardTitle>
        <CardDescription>
          We encountered an error while loading the onboarding setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Details</AlertTitle>
          <AlertDescription className="text-xs break-all">
            {error.message || "An unknown error occurred."}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button onClick={reset} className="w-full">
          <RefreshCcw className=" h-4 w-4" />
          Try again
        </Button>
      </CardFooter>
    </Card>
  );
}
