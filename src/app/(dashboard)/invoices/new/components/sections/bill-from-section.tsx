"use client";

import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, ExternalLink, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import type { InvoiceFormValues } from "../invoice-form";

interface BillFromSectionProps {
  logoUrl?: string | null;
  signatureUrl?: string | null;
  isSettingsIncomplete: boolean;
}

export function BillFromSection({
  logoUrl,
  signatureUrl,
  isSettingsIncomplete,
}: BillFromSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const currency = useWatch<InvoiceFormValues, "currency">({
    name: "currency",
  });
  const showGstinPan = currency === "INR";

  return (
    <div className="space-y-4">
      {isSettingsIncomplete && (
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/30">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-snug">
            Complete your business profile to autofill these fields.{" "}
            <Link
              href="/settings/profile"
              className="font-medium underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-200 inline-flex items-center gap-1"
            >
              Go to Settings
              <ExternalLink className="h-3 w-3" />
            </Link>
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field data-invalid={!!errors.fromName} className="sm:col-span-2">
          <FieldTitle>Business Name</FieldTitle>

          <Input
            id="from-name"
            placeholder="Your business name"
            className="h-10"
            {...register("fromName")}
            aria-invalid={!!errors.fromName}
          />

          <FieldError errors={[errors.fromName as { message?: string }]} />
        </Field>

        <Field data-invalid={!!errors.fromEmail}>
          <FieldTitle>Business Email</FieldTitle>

          <Input
            id="from-email"
            type="email"
            placeholder="you@example.com"
            className="h-10"
            {...register("fromEmail")}
            aria-invalid={!!errors.fromEmail}
          />

          <FieldError errors={[errors.fromEmail as { message?: string }]} />
        </Field>

        <Field>
          <FieldTitle>Business Phone</FieldTitle>

          <Input
            id="from-phone"
            type="tel"
            placeholder="+91 98765 43210"
            className="h-10"
            {...register("fromPhone")}
          />
        </Field>

        <Field className="sm:col-span-2">
          <FieldTitle>Business Address</FieldTitle>

          <ScrollArea className="h-12 rounded-lg border bg-background shadow-sm ring-offset-background focus-within:ring-ring/50 focus-within:ring-[3px] transition-all">
            <Textarea
              id="from-address"
              placeholder="Street, City, State, PIN"
              className="min-h-full resize-none border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              {...register("fromAddress")}
            />
          </ScrollArea>
        </Field>

        {showGstinPan && (
          <>
            <Field>
              <FieldTitle>GSTIN</FieldTitle>
              <Input
                id="from-gstin"
                placeholder="22AAAAA0000A1Z5"
                className="h-10 font-mono uppercase"
                {...register("fromGstin")}
              />
            </Field>

            <Field>
              <FieldTitle>PAN</FieldTitle>
              <Input
                id="from-pan"
                placeholder="AAAAA0000A"
                className="h-10 font-mono uppercase"
                {...register("fromPan")}
              />
            </Field>
          </>
        )}
      </div>

      {(logoUrl || signatureUrl) && (
        <div className="flex flex-wrap gap-4 pt-1">
          {logoUrl && (
            <ImagePreview
              src={logoUrl as string}
              label="Logo"
              settingsPath="/settings/profile"
            />
          )}

          {signatureUrl && (
            <ImagePreview
              src={signatureUrl as string}
              label="Signature"
              settingsPath="/settings/profile"
            />
          )}
        </div>
      )}
    </div>
  );
}

function ImagePreview({
  src,
  label,
  settingsPath,
}: {
  src: string;
  label: string;
  settingsPath: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <Link
        href={settingsPath}
        className="group relative flex h-16 w-28 items-center justify-center overflow-hidden rounded-lg border bg-muted/30 hover:border-ring transition-colors"
        title={`Change ${label} in Settings`}
      >
        <Image
          src={src}
          alt={label}
          fill
          className="object-contain p-1.5"
          onError={() => {}}
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </Link>
    </div>
  );
}

export function ImagePreviewFallback({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex h-16 w-28 items-center justify-center rounded-lg border border-dashed bg-muted/20">
        <ImageOff className="h-4 w-4 text-muted-foreground/40" />
      </div>
    </div>
  );
}
