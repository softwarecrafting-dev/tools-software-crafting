"use client";

import {
  AlertBanner,
  BannerVariant,
  PasswordInput,
  PasswordStrengthBar,
} from "@/app/(auth)/register/components/register-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

export function ResetPasswordForm({ token }: { token: string }) {
  const [success, setSuccess] = React.useState(false);
  const [banner, setBanner] = React.useState<{
    type: BannerVariant;
    message: string;
  } | null>(null);
  const [shake, setShake] = React.useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = form.watch("password");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },

    onSuccess: () => {
      setSuccess(true);
    },

    onError: (error) => {
      try {
        const json = JSON.parse(error.message);
        setBanner({
          type: "error",
          message: json.error ?? "Something went wrong. Please try again.",
        });
        triggerShake();
      } catch {
        setBanner({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
        triggerShake();
      }
    },
  });

  function onSubmit(data: ResetPasswordInput) {
    setBanner(null);
    mutate(data);
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="shadow-lg border-border/60 text-center">
          <CardHeader className="space-y-4 items-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Password reset successful
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                Your password has been reset successfully. You can now use your
                new password to sign in.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-lg"
    >
      <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}>
        <Card className="shadow-lg border-border/60">
          <CardHeader className="text-center space-y-1">
            <p className="text-lg font-semibold tracking-tight text-primary">
              SoftwareCrafting
            </p>
            <CardTitle className="text-2xl font-bold">
              Reset your password
            </CardTitle>
            <CardDescription>
              Choose a strong password to secure your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="reset-password-form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="flex flex-col gap-5">
                <AnimatePresence mode="wait">
                  {banner && (
                    <AlertBanner key="banner" variant={banner.type}>
                      {banner.message}
                    </AlertBanner>
                  )}
                </AnimatePresence>

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reset-password">
                        New password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="reset-password"
                        placeholder="Min 4 characters"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />
                      <PasswordStrengthBar password={password} />
                      <FieldDescription>
                        Must be at least 4 characters
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reset-confirm-password">
                        Confirm new password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="reset-confirm-password"
                        placeholder="Repeat your password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              form="reset-password-form"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className=" animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
