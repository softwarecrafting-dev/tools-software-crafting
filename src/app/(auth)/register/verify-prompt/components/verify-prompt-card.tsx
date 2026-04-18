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
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

export function VerifyPromptCard({ email }: { email: string | null }) {
  const [rateLimited, setRateLimited] = React.useState(false);

  const { mutate: handleResend, isPending: sending } = useMutation({
    mutationFn: async () => {
      if (!email) throw new Error("No email provided");

      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        throw new Error("RATE_LIMITED");
      }

      if (!res.ok) {
        throw new Error("Request failed");
      }

      return res.json();
    },

    onSuccess: () => {
      toast.success("Verification email resent. Check your inbox.");
    },

    onError: (error) => {
      if (error.message === "RATE_LIMITED") {
        setRateLimited(true);

        toast.warning("Wait before requesting another link.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-lg border-border/60 text-center">
        <CardHeader className="space-y-4 items-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Check your email
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-muted-foreground">
              We sent a verification link to{" "}
              {email ? (
                <span className="font-semibold text-foreground">{email}</span>
              ) : (
                "your email address"
              )}
              . Click the link to activate your account.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              if (!email || rateLimited) return;
              handleResend();
            }}
            disabled={sending || rateLimited || !email}
            className="w-full"
          >
            {sending ? (
              <>
                <Loader2 size={15} className=" animate-spin" />
                Sending...
              </>
            ) : rateLimited ? (
              "Wait before requesting another link"
            ) : (
              "Resend verification email"
            )}
          </Button>
        </CardContent>

        <CardFooter className="flex-col items-center space-y-3 pt-6 border-t border-border/60">
          <p className="text-xs text-muted-foreground text-center">
            Wrong email address?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline underline-offset-2"
            >
              Sign in with a different account
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Check your spam or junk folder if you don&apos;t see it within 2
            minutes.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
