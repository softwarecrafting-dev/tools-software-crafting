"use client";

import { motion } from "motion/react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  { title: "Business", description: "Basic Profile" },
  { title: "Legal", description: "Tax Details" },
  { title: "Settings", description: "Default Config" },
];

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={step.title}
              className="flex flex-col items-center flex-1 relative"
            >
              {index > 0 && (
                <div
                  className={`absolute right-1/2 left-[-50%] top-4 h-0.5 -translate-y-1/2 transition-colors duration-500 ${
                    isCompleted || isActive ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}

              <div
                className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground scale-110 shadow-lg"
                    : isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                ) : (
                  stepNumber
                )}
              </div>

              <div className="mt-2 text-center hidden sm:block">
                <p
                  className={`text-xs font-semibold ${
                    isActive || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut", type: "tween" }}
        />
      </div>
    </div>
  );
}
