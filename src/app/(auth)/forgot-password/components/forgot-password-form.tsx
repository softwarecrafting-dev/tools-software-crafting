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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/hooks/use-auth";
import {
  ForgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AlertBanner,
  BannerVariant,
  getAuthError,
} from "../../register/components/register-form";

export function ForgotPasswordForm() {
  const [success, setSuccess] = React.useState(false);
  const [banner, setBanner] = React.useState<{
    type: BannerVariant;
    message: string;
  } | null>(null);
  const [shake, setShake] = React.useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useForgotPassword();

  function onSubmit(data: ForgotPasswordInput) {
    setBanner(null);

    mutate(data, {
      onSuccess: () => setSuccess(true),

      onError: (error) => {
        setBanner({ type: "error", message: getAuthError(error) });
        triggerShake();
      },
    });
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
                Check your email
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                If an account exists for{" "}
                <span className="font-semibold text-foreground">
                  {form.getValues("email")}
                </span>
                , you will receive a password reset link shortly.
              </CardDescription>
            </div>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Return to Login</Link>
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
              Forgot password?
            </CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="forgot-password-form"
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
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="forgot-email">
                        Email address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="forgot-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
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

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              form="forgot-password-form"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className=" animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link href="/login" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
