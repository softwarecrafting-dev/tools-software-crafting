"use client";

import { Field } from "@/components/ui/field";
import { FloatingInput } from "@/components/ui/floating-label";
import { AnimatePresence, motion } from "motion/react";
import { useFormContext, useWatch } from "react-hook-form";
import type { InvoiceFormValues } from "../invoice-form";

export function PaymentDetailsSection() {
  const { register, control } = useFormContext<InvoiceFormValues>();

  const currency = useWatch({ control, name: "currency" });
  const isInr = currency === "INR";

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field className="sm:col-span-1">
          <FloatingInput label="Bank Name" {...register("bankName")} />
        </Field>

        <Field className="sm:col-span-1">
          <FloatingInput label="Account Name" {...register("accountName")} />
        </Field>

        <Field className="sm:col-span-1">
          <FloatingInput
            label="Account Number"
            {...register("accountNumber")}
          />
        </Field>

        <AnimatePresence mode="popLayout">
          {isInr ? (
            <>
              <motion.div
                key="ifsc"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <Field>
                  <FloatingInput
                    label="IFSC Code"
                    className="uppercase"
                    {...register("ifscCode")}
                  />
                </Field>
              </motion.div>

              <motion.div
                key="upi"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                <Field>
                  <FloatingInput label="UPI ID" {...register("upiId")} />
                </Field>
              </motion.div>
            </>
          ) : (
            <motion.div
              key="swift"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="sm:col-span-2 lg:col-span-1"
            >
              <Field>
                <FloatingInput
                  label="SWIFT/BIC"
                  className="uppercase"
                  {...register("swiftBic")}
                />
              </Field>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
