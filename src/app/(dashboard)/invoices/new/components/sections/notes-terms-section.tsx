"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { FloatingTextarea } from "@/components/ui/floating-label";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { InvoiceFormValues } from "../invoice-form";

export function NotesTermsSection() {
  const { register } = useFormContext<InvoiceFormValues>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      <Field>
        <FloatingTextarea
          label="Notes to Client"
          className=""
          {...register("notes")}
        />
      </Field>

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none"
            >
              Terms & Conditions
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          </CollapsibleTrigger>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <CollapsibleContent forceMount asChild>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <Field className="pt-2">
                  <FloatingTextarea
                    label="Terms & Conditions"
                    className=""
                    {...register("terms")}
                  />
                </Field>
              </motion.div>
            </CollapsibleContent>
          )}
        </AnimatePresence>
      </Collapsible>
    </div>
  );
}
