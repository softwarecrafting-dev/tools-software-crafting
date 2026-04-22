"use client";

import { AlertBanner } from "@/app/(auth)/register/components/register-form";
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
  useCompleteOnboarding,
  useSettings,
  useUpdateSettings,
} from "@/hooks/use-settings";
import { ApiError } from "@/lib/api-client";
import type { SettingsInput } from "@/lib/validators/settings";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { OnboardingSkeleton } from "./onboarding-skeleton";
import { BankingStep, LegalStep, ProfileStep } from "./onboarding-steps";
import { StepIndicator } from "./step-indicator";

type BannerState = {
  type: "error" | "warning";
  message: string;
} | null;

export function OnboardingForm() {
  const router = useRouter();

  const [[step, direction], setStep] = React.useState<[number, number]>([1, 0]);

  const [banner, setBanner] = React.useState<BannerState>(null);
  const [shake, setShake] = React.useState(false);

  const {
    data: initialSettings,
    isLoading: isLoadingSettings,
    isError,
    refetch,
  } = useSettings();

  const updateSettingsMutation = useUpdateSettings();
  const completeOnboardingMutation = useCompleteOnboarding();

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  async function handleNext(data: Partial<SettingsInput>) {
    try {
      setBanner(null);

      await updateSettingsMutation.mutateAsync(data);

      if (step < 3) {
        setStep([step + 1, 1]);
      } else {
        await completeOnboardingMutation.mutateAsync();
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Failed to save progress. Please try again.";

      setBanner({ type: "error", message });
      triggerShake();
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep([step - 1, -1]);
    }
  }

  if (isLoadingSettings) {
    return <OnboardingSkeleton />;
  }

  if (isError) {
    return (
      <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}>
        <Card className="border-border/61 shadow-lg px-4 py-8">
          <CardHeader className="text-center space-y-2">
            <div className="mb-3 rounded-full mx-auto bg-destructive/10 p-3 w-fit">
              <AlertCircle className="h-7 w-8 text-destructive" />
            </div>

            <CardTitle className="text-xl font-bold">
              Failed to load setup
            </CardTitle>

            <CardDescription>
              We couldn&apos;t retrieve your business settings.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <AlertBanner variant="error">
              Connectivity issue or server error.
            </AlertBanner>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => {
                triggerShake();
                refetch();
              }}
              className="w-full"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const stepValues: Partial<SettingsInput> = {
    businessName: initialSettings?.businessName || "",
    businessAddress: initialSettings?.businessAddress || "",
    businessEmail: initialSettings?.businessEmail || "",
    businessPhone: initialSettings?.businessPhone || "",
    gstin: initialSettings?.gstin || "",
    pan: initialSettings?.pan || "",
    bankName: initialSettings?.bankName || "",
    bankAccountNumber: initialSettings?.bankAccountNumber || "",
    bankIfsc: initialSettings?.bankIfsc || "",
    bankUpiId: initialSettings?.bankUpiId || "",
    defaultCurrency: initialSettings?.defaultCurrency || "INR",
    defaultTaxRate: initialSettings?.defaultTaxRate || "19.00",
    invoicePrefix: initialSettings?.invoicePrefix || "INV",
    defaultPaymentTerms: initialSettings?.defaultPaymentTerms || "",
    defaultNotes: initialSettings?.defaultNotes || "",
  };

  const slideTransition = {
    duration: 0.35,
    ease: "easeInOut",
    type: "tween",
  } as const;

  return (
    <motion.div animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}>
      <Card className="border-border/61 shadow-lg overflow-hidden flex flex-col min-h-lg">
        <CardHeader className="pb-3 shrink-0">
          <StepIndicator currentStep={step} totalSteps={3} />

          <CardTitle className="text-xl">
            {step === 1 && "Business Profile"}
            {step === 2 && "Legal & Identity"}
            {step === 3 && "Banking & Invoicing"}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <AnimatePresence mode="wait">
            {banner && (
              <AlertBanner key="banner" variant={banner.type}>
                {banner.message}
              </AlertBanner>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 120 : -120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -120 : 120 }}
              transition={slideTransition}
              className="w-full"
            >
              {step === 1 && (
                <ProfileStep
                  defaultValues={stepValues}
                  onNext={handleNext}
                  isLoading={updateSettingsMutation.isPending}
                />
              )}

              {step === 2 && (
                <LegalStep
                  defaultValues={stepValues}
                  onNext={handleNext}
                  onBack={handleBack}
                  isLoading={updateSettingsMutation.isPending}
                />
              )}

              {step === 3 && (
                <BankingStep
                  defaultValues={stepValues}
                  onNext={handleNext}
                  onBack={handleBack}
                  isLoading={
                    updateSettingsMutation.isPending ||
                    completeOnboardingMutation.isPending
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
