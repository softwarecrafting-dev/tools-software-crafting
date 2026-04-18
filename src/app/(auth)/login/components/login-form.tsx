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
import { LoginSchema, type LoginInput } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

function PasswordInput({
  id,
  placeholder,
  ...props
}: React.ComponentProps<typeof Input> & { id: string }) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        {...props}
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className="pl-10 pr-10"
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

export function LoginForm() {
  const router = useRouter();
  const [shake, setShake] = React.useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(json));
      }

      return json;
    },

    onSuccess: () => {
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    },

    onError: (error) => {
      try {
        const json = JSON.parse(error.message);
        toast.error(json.error || "Invalid email or password");
      } catch {
        toast.error("Something went wrong. Please try again.");
      }

      triggerShake();
    },
  });

  function onSubmit(data: LoginInput) {
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

            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>

            <CardDescription>
              Sign in to continue to your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <FieldGroup className="flex flex-col gap-5">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-email">
                        Email address
                      </FieldLabel>

                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-invalid={fieldState.invalid}
                          disabled={isPending}
                          className="pl-10"
                        />
                      </div>

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
                      <FieldLabel htmlFor="login-password">Password</FieldLabel>

                      <PasswordInput
                        {...field}
                        id="login-password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        disabled={isPending}
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
              form="login-form"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline underline-offset-2"
              >
                Sign up
              </Link>
            </p>

            <p className="text-sm text-center">
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
              >
                Forgot your password?
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
}
