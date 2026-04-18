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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RegisterSchema, type RegisterInput } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";

type PasswordStrength = 0 | 1 | 2 | 3 | 4;

const strengthLabels: Record<PasswordStrength, string> = {
  0: "",
  1: "Weak",
  2: "Fair",
  3: "Good",
  4: "Strong",
};

const strengthColors: Record<PasswordStrength, string> = {
  0: "bg-muted",
  1: "bg-destructive",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
};

export function computeStrength(password: string): PasswordStrength {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4) as PasswordStrength;
}

export function PasswordStrengthBar({ password }: { password: string }) {
  const strength = computeStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {([1, 2, 3, 4] as PasswordStrength[]).map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              strength >= level ? strengthColors[strength] : "bg-muted"
            }`}
          />
        ))}
      </div>
      {strength > 0 && (
        <p
          className={`text-xs font-medium ${
            strength === 1
              ? "text-destructive"
              : strength === 2
                ? "text-orange-500"
                : strength === 3
                  ? "text-yellow-600"
                  : "text-green-600"
          }`}
        >
          {strengthLabels[strength]}
        </p>
      )}
    </div>
  );
}

export function PasswordInput({
  id,
  placeholder,
  ...props
}: React.ComponentProps<typeof Input> & { id: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <Input
        {...props}
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export type BannerVariant = "error" | "warning";

export function AlertBanner({
  variant,
  children,
}: {
  variant: BannerVariant;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
        variant === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      }`}
    >
      <AlertCircle size={15} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </motion.div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [banner, setBanner] = React.useState<{
    type: BannerVariant;
    message: string;
  } | null>(null);
  const [shake, setShake] = React.useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const password = form.watch("password");

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(JSON.stringify(json));
      }

      return { data, json };
    },

    onSuccess: ({ data }) => {
      router.push(
        `/register/verify-prompt?email=${encodeURIComponent(data.email)}`,
      );
    },

    onError: (error) => {
      try {
        const json = JSON.parse(error.message);

        if (json.code === "EMAIL_ALREADY_EXISTS") {
          setBanner({ type: "warning", message: json.error });
        } else {
          setBanner({
            type: "error",
            message: json.error ?? "Something went wrong. Please try again.",
          });
          triggerShake();
        }
      } catch {
        setBanner({
          type: "error",
          message: "Something went wrong. Please try again.",
        });
        triggerShake();
      }
    },
  });

  function onSubmit(data: RegisterInput) {
    setBanner(null);
    mutate(data);
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
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
              Create your account
            </CardTitle>
            <CardDescription>
              Free forever. No credit card needed.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="register-form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="flex flex-col gap-5">
                <AnimatePresence mode="wait">
                  {banner && (
                    <AlertBanner key="banner" variant={banner.type}>
                      {banner.message}
                      {banner.type === "warning" && (
                        <>
                          {" "}
                          <Link
                            href="/login"
                            className="font-semibold underline underline-offset-2"
                          >
                            Sign in instead
                          </Link>
                        </>
                      )}
                    </AlertBanner>
                  )}
                </AnimatePresence>

                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reg-name">Full name</FieldLabel>
                      <Input
                        {...field}
                        id="reg-name"
                        type="text"
                        placeholder="Name"
                        autoComplete="name"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reg-email">Email address</FieldLabel>
                      <Input
                        {...field}
                        id="reg-email"
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

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reg-password">Password</FieldLabel>
                      <PasswordInput
                        {...field}
                        id="reg-password"
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
                      <FieldLabel htmlFor="reg-confirm-password">
                        Confirm password
                      </FieldLabel>
                      <PasswordInput
                        {...field}
                        id="reg-confirm-password"
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

                <Controller
                  name={"terms" as keyof RegisterInput}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                      className="items-center  mt-2"
                    >
                      <Checkbox
                        id="reg-terms"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel
                        htmlFor="reg-terms"
                        className="text-sm font-normal leading-relaxed"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          target="_blank"
                          className="text-primary underline underline-offset-2"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          target="_blank"
                          className="text-primary underline underline-offset-2"
                        >
                          Privacy Policy
                        </Link>
                      </FieldLabel>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              form="register-form"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className=" animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
