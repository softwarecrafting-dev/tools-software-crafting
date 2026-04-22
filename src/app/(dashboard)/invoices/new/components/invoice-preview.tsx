"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import type { InvoiceFormValues } from "./invoice-form";
import { ClassicPreview } from "./preview/preview-classic";
import { MinimalPreview } from "./preview/preview-minimal";
import { ModernPreview } from "./preview/preview-modern";

export function InvoicePreview() {
  const { control, setValue } = useFormContext<InvoiceFormValues>();

  const watchedValues = useWatch({ control });
  const [debouncedValues] = useDebounce(watchedValues, 300);

  const template = watchedValues.template || "minimal";

  return (
    <div className="sticky top-8 space-y-6">
      <div className="flex items-center justify-between">
        <Tabs
          value={template}
          onValueChange={(v) =>
            setValue("template", v as InvoiceFormValues["template"], {
              shouldDirty: true,
            })
          }
          className="w-full max-w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="minimal">Minimal</TabsTrigger>
            <TabsTrigger value="classic">Classic</TabsTrigger>
            <TabsTrigger value="modern">Modern</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="relative min-h-[842px] w-full overflow-hidden  text-foreground shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={template}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {template === "minimal" && (
              <MinimalPreview data={debouncedValues as InvoiceFormValues} />
            )}
            {template === "classic" && (
              <ClassicPreview data={debouncedValues as InvoiceFormValues} />
            )}
            {template === "modern" && (
              <ModernPreview data={debouncedValues as InvoiceFormValues} />
            )}
          </motion.div>
        </AnimatePresence>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" className="gap-2" disabled>
          <Download className="size-4" />
          Download PDF Preview
        </Button>
      </div>
    </div>
  );
}
