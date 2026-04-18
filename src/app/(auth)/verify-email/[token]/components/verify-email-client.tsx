"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, Info, XCircle } from "lucide-react";
import Link from "next/link";

export type VerifyResponse = {
  status: number;
  success?: boolean;
  code?:
    | "ALREADY_VERIFIED"
    | "TOKEN_EXPIRED"
    | "INVALID_TOKEN"
    | "INTERNAL_ERROR";
  message?: string;
  error?: string;
};

export function VerifyEmailClient({ token }: { token: string }) {
  const { data, error, isPending } = useQuery<VerifyResponse>({
    queryKey: ["verify-email", token],

    queryFn: async () => {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const json = await res.json();
      if (!res.ok && res.status !== 400 && res.status !== 200) {
        throw new Error("INTERNAL_ERROR");
      }

      return { status: res.status, ...json };
    },

    retry: false,
    refetchOnWindowFocus: false,
  });

  const renderState = () => {
    if (isPending) {
      return (
        <Card className="shadow-lg border-border/60 text-center">
          <CardHeader className="space-y-4 items-center">
            <Skeleton className="mx-auto h-14 w-14 rounded-full" />
            <div className="space-y-3 w-full">
              <Skeleton className="mx-auto h-8 w-48" />
              <div className="space-y-2 pt-1 w-full justify-center flex flex-col items-center">
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
        </Card>
      );
    }

    if (error || data?.code === "INTERNAL_ERROR") {
      return (
        <Card className="shadow-lg border-border/60 text-center">
          <CardHeader className="space-y-4 items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-7 w-7 text-destructive" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Error
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                Something went wrong while verifying your email.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      );
    }

    if (data?.code === "ALREADY_VERIFIED") {
      return (
        <Card className="shadow-lg border-border/60 text-center">
          <CardHeader className="space-y-4 items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <Info className="h-7 w-7 text-blue-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Already verified
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                Your email is already verified.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      );
    }

    if (data?.code === "TOKEN_EXPIRED") {
      return (
        <Card className="shadow-lg border-border/60 text-center">
          <CardHeader className="space-y-4 items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500/10">
              <Clock className="h-7 w-7 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                This link has expired
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                Verification links expire after 24 hours.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/register/verify-prompt">Request a new link</Link>
            </Button>
          </CardFooter>
        </Card>
      );
    }

    if (data?.code === "INVALID_TOKEN") {
      return (
        <Card className="shadow-lg border-border/60 text-center">
          <CardHeader className="space-y-4 items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-7 w-7 text-destructive" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Invalid link
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                This verification link is invalid or has already been used.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Back to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="shadow-lg border-border/60 text-center">
        <CardHeader className="space-y-4 items-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Email verified!
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              Your account is now active. Let&apos;s set up your workspace.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/onboarding">Continue to Setup</Link>
          </Button>
        </CardContent>
      </Card>
    );
  };

  return <div className="w-full max-w-lg">{renderState()}</div>;
}
