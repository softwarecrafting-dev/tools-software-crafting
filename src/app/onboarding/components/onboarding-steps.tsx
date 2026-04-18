"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { SettingsInput } from "@/lib/validators/settings";
import { SettingsSchema } from "@/lib/validators/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface StepProps {
  defaultValues: Partial<SettingsInput>;
  onNext: (data: Partial<SettingsInput>) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const ProfileSchema = SettingsSchema.pick({
  businessName: true,
  businessAddress: true,
  businessEmail: true,
  businessPhone: true,
});

type ProfileInput = z.infer<typeof ProfileSchema>;

export function ProfileStep({ defaultValues, onNext, isLoading }: StepProps) {
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      businessName: defaultValues.businessName || "",
      businessAddress: defaultValues.businessAddress || "",
      businessEmail: defaultValues.businessEmail || "",
      businessPhone: defaultValues.businessPhone || "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-4">
        <Field data-invalid={!!form.formState.errors.businessName}>
          <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
          <Input
            id="businessName"
            placeholder="e.g. Acme Corp"
            {...form.register("businessName")}
          />
          <FieldError errors={[form.formState.errors.businessName]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.businessAddress}>
          <FieldLabel htmlFor="businessAddress">Business Address</FieldLabel>
          <Input
            id="businessAddress"
            placeholder="Complete physical address"
            {...form.register("businessAddress")}
          />
          <FieldError errors={[form.formState.errors.businessAddress]} />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.businessEmail}>
            <FieldLabel htmlFor="businessEmail">Business Email</FieldLabel>
            <Input
              id="businessEmail"
              type="email"
              placeholder="billing@acme.com"
              {...form.register("businessEmail")}
            />
            <FieldError errors={[form.formState.errors.businessEmail]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.businessPhone}>
            <FieldLabel htmlFor="businessPhone">Business Phone</FieldLabel>
            <Input
              id="businessPhone"
              placeholder="+91 9876543210"
              {...form.register("businessPhone")}
            />
            <FieldError errors={[form.formState.errors.businessPhone]} />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <Loader2 className=" h-4 w-4 animate-spin" /> : null}
          Continue to Legal Info
          <ArrowRight className=" h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

const LegalSchema = SettingsSchema.pick({
  gstin: true,
  pan: true,
});

type LegalInput = z.infer<typeof LegalSchema>;

export function LegalStep({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: StepProps) {
  const form = useForm<LegalInput>({
    resolver: zodResolver(LegalSchema),
    defaultValues: {
      gstin: defaultValues.gstin || "",
      pan: defaultValues.pan || "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
      <FieldGroup className="flex flex-col gap-4">
        <Field data-invalid={!!form.formState.errors.gstin}>
          <FieldLabel htmlFor="gstin">GSTIN (Optional)</FieldLabel>
          <Input
            id="gstin"
            placeholder="22AAAAA0000A1Z5"
            {...form.register("gstin")}
          />
          <FieldError errors={[form.formState.errors.gstin]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.pan}>
          <FieldLabel htmlFor="pan">PAN (Optional)</FieldLabel>
          <Input id="pan" placeholder="ABCDE1234F" {...form.register("pan")} />
          <FieldError errors={[form.formState.errors.pan]} />
        </Field>
      </FieldGroup>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" type="button" onClick={onBack}>
          <ArrowLeft className=" h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? <Loader2 className=" h-4 w-4 animate-spin" /> : null}
          Continue to Banking
          <ArrowRight className=" h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

const BankingSchema = SettingsSchema.pick({
  bankName: true,
  bankAccountNumber: true,
  bankIfsc: true,
  bankUpiId: true,
  defaultCurrency: true,
  defaultTaxRate: true,
  invoicePrefix: true,
});

type BankingInput = z.infer<typeof BankingSchema>;

export function BankingStep({
  defaultValues,
  onNext,
  onBack,
  isLoading,
}: StepProps) {
  const form = useForm<BankingInput>({
    resolver: zodResolver(
      BankingSchema,
    ) as import("react-hook-form").Resolver<BankingInput>,
    defaultValues: {
      bankName: defaultValues.bankName || "",
      bankAccountNumber: defaultValues.bankAccountNumber || "",
      bankIfsc: defaultValues.bankIfsc || "",
      bankUpiId: defaultValues.bankUpiId || "",
      defaultCurrency: defaultValues.defaultCurrency || "INR",
      defaultTaxRate: defaultValues.defaultTaxRate || "18.00",
      invoicePrefix: defaultValues.invoicePrefix || "INV",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field data-invalid={!!form.formState.errors.bankName}>
          <FieldLabel htmlFor="bankName">Bank Name</FieldLabel>
          <Input
            id="bankName"
            placeholder="ICICI Bank"
            {...form.register("bankName")}
          />
          <FieldError errors={[form.formState.errors.bankName]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.bankAccountNumber}>
          <FieldLabel htmlFor="bankAccountNumber">Account Number</FieldLabel>
          <Input
            id="bankAccountNumber"
            placeholder="000012345678"
            {...form.register("bankAccountNumber")}
          />
          <FieldError errors={[form.formState.errors.bankAccountNumber]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.bankIfsc}>
          <FieldLabel htmlFor="bankIfsc">IFSC Code</FieldLabel>
          <Input
            id="bankIfsc"
            placeholder="ICIC0001234"
            {...form.register("bankIfsc")}
          />
          <FieldError errors={[form.formState.errors.bankIfsc]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.bankUpiId}>
          <FieldLabel htmlFor="bankUpiId">UPI ID (Optional)</FieldLabel>
          <Input
            id="bankUpiId"
            placeholder="username@upi"
            {...form.register("bankUpiId")}
          />
          <FieldError errors={[form.formState.errors.bankUpiId]} />
        </Field>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-sm font-semibold mb-4">Invoice Defaults</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field data-invalid={!!form.formState.errors.defaultCurrency}>
            <FieldLabel htmlFor="defaultCurrency">Currency</FieldLabel>
            <Input id="defaultCurrency" {...form.register("defaultCurrency")} />
            <FieldError errors={[form.formState.errors.defaultCurrency]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.defaultTaxRate}>
            <FieldLabel htmlFor="defaultTaxRate">Tax Rate (%)</FieldLabel>
            <Input id="defaultTaxRate" {...form.register("defaultTaxRate")} />
            <FieldError errors={[form.formState.errors.defaultTaxRate]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.invoicePrefix}>
            <FieldLabel htmlFor="invoicePrefix">Invoice Prefix</FieldLabel>
            <Input id="invoicePrefix" {...form.register("invoicePrefix")} />
            <FieldError errors={[form.formState.errors.invoicePrefix]} />
          </Field>
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-4">
        <Button variant="outline" type="button" onClick={onBack}>
          <ArrowLeft className=" h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-none"
        >
          {isLoading ? <Loader2 className=" h-4 w-4 animate-spin" /> : null}
          Finalize Setup
          <ArrowRight className=" h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
