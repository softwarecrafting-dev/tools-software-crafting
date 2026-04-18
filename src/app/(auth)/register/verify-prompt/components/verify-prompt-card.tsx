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
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import * as React from "react";
import { AlertBanner, BannerVariant } from "../../components/register-form";

export function VerifyPromptCard({ email }: { email: string | null }) {
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const [banner, setBanner] = React.useState<{
    type: BannerVariant;
    message: string;
  } | null>(null);

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
      setCountdown(60);
      setBanner({
        type: "warning",
        message: "Verification email resent. Please check your inbox.",
      });
    },

    onError: (error) => {
      if (error.message === "RATE_LIMITED") {
        setCountdown(60);
        setBanner({
          type: "warning",
          message:
            "Too many requests. Please wait a minute before trying again.",
        });
      } else {
        setBanner({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
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

        <CardContent className="space-y-4">
          <AnimatePresence mode="wait">
            {banner && (
              <AlertBanner key="banner" variant={banner.type}>
                {banner.message}
              </AlertBanner>
            )}
          </AnimatePresence>

          <Button
            variant="outline"
            onClick={() => {
              if (!email || countdown > 0) return;
              setBanner(null);
              handleResend();
            }}
            disabled={sending || countdown > 0 || !email}
            className="w-full"
          >
            {sending ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
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
