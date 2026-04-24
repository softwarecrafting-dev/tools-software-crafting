"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDownloadInvoicePdf } from "@/hooks/use-invoice-pdf";
import { Download, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import type { InvoiceFormValues } from "./invoice-form";
import { ClassicPreview } from "./preview/preview-classic";
import { MinimalPreview } from "./preview/preview-minimal";
import { ModernPreview } from "./preview/preview-modern";

export function InvoicePreview() {
  const { control, setValue, register } = useFormContext<InvoiceFormValues>();

  const watchedValues = useWatch({ control });
  const [debouncedValues] = useDebounce(watchedValues, 300);

  const template = watchedValues.template || "minimal";
  const watchedId = watchedValues.id;
  const invoiceNumber = watchedValues.invoiceNumber || "Draft";

  const [persistentId, setPersistentId] = useState<string | undefined>(
    watchedId,
  );
  useEffect(() => {
    if (watchedId && watchedId !== persistentId) {
      setPersistentId(watchedId);
    }
  }, [watchedId, persistentId]);

  const invoiceId = watchedId || persistentId;

  const { mutate: downloadPdf, isPending } = useDownloadInvoicePdf();

  const handleDownload = () => {
    if (!invoiceId) return;

    downloadPdf({ id: invoiceId, invoiceNumber });
  };

  return (
    <div className="sticky top-24 space-y-4">
      <input type="hidden" {...register("id")} />
      {/* <div className="mb-4">
        <SavingIndicator isSaving={isSaving} lastSavedAt={lastSavedAt} />
      </div> */}
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

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={!invoiceId || isPending}
                  onClick={handleDownload}
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Download PDF
                </Button>
              </span>
            </TooltipTrigger>

            {!invoiceId && (
              <TooltipContent>
                <p>Save as draft first to download PDF</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>

      <Card className="relative aspect-[1/1.4142] w-full overflow-hidden text-foreground  border-border/50">
        <div className="absolute inset-0 overflow-auto scrollbar-hide">
          <div className=" origin-top scale-(--preview-scale,1)">
            <AnimatePresence mode="wait">
              <motion.div
                key={template}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
        <span>A4 Standard Layout</span>
        <span>Real-time Sync Active</span>
      </div>
    </div>
  );
}
