"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useSendInvoice } from "@/hooks/use-invoices";
import {
  InvoiceSendSchema,
  type InvoiceSendInput,
} from "@/lib/validators/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Send } from "lucide-react";
import { useEffect } from "react";
import {
  useForm,
  useWatch,
  type Resolver,
  type SubmitHandler,
  type UseFormSetValue,
} from "react-hook-form";
import type { InvoiceFormValues } from "./invoice-form";

interface SendInvoiceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null | undefined;
  clientEmail: string;
  invoiceNumber: string;
  businessName: string;
  amount: string;
  onSuccess?: () => void;
  saveDraft: (
    data: InvoiceFormValues,
    isAutosave?: boolean,
    setValue?: UseFormSetValue<InvoiceFormValues>,
  ) => Promise<string | null | undefined>;
  getFormValues: () => InvoiceFormValues;
  setValue: UseFormSetValue<InvoiceFormValues>;
}

export function SendInvoiceModal({
  isOpen,
  onOpenChange,
  invoiceId,
  clientEmail,
  invoiceNumber,
  businessName,
  amount,
  onSuccess,
  saveDraft,
  getFormValues,
  setValue,
}: SendInvoiceModalProps) {
  const sendMutation = useSendInvoice();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
    setValue: setSendValue,
    control,
  } = useForm<InvoiceSendInput>({
    resolver: zodResolver(InvoiceSendSchema) as Resolver<InvoiceSendInput>,
    defaultValues: {
      toEmail: clientEmail,
      subject: `Invoice ${invoiceNumber} from ${businessName}`,
      message: `Dear Client,\n\nPlease find attached invoice ${invoiceNumber} for ${amount}.\n\nBest regards,\n${businessName}`,
      attachPdf: true,
    },
  });

  const attachPdf = useWatch({
    control,
    name: "attachPdf",
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        toEmail: clientEmail || getValues("toEmail"),
        subject: `Invoice ${invoiceNumber} from ${businessName}`,
        message: `Dear Client,\n\nPlease find attached invoice ${invoiceNumber} for ${amount}.\n\nBest regards,\n${businessName}`,
        attachPdf: true,
      });
    }
  }, [
    isOpen,
    clientEmail,
    invoiceNumber,
    businessName,
    amount,
    reset,
    getValues,
  ]);

  const onSubmit: SubmitHandler<InvoiceSendInput> = async (data) => {
    try {
      let currentId = invoiceId;

      if (!currentId) {
        const formValues = getFormValues();
        const savedId = await saveDraft(formValues, false, setValue);

        if (!savedId) return;

        currentId = savedId;
      }

      await sendMutation.mutateAsync({
        id: currentId,
        payload: data,
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Send flow error:", error);
    }
  };

  const isPending = sendMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="">
        <SheetHeader className="flex flex-col items-center justify-center">
          <div className="bg-primary/5 w-fit p-2 rounded-xl mb-2 border border-primary/10">
            <Mail className="size-5 text-primary" />
          </div>

          <SheetTitle className="text-2xl font-bold tracking-tight">
            Send Invoice
          </SheetTitle>

          <SheetDescription className="text-muted-foreground text-center">
            Send invoice {invoiceNumber} to your client via email.
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 px-3 flex flex-col space-y-6 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6 pt-4">
            <Field data-invalid={!!errors.toEmail}>
              <FieldTitle>To Address</FieldTitle>
              <Input
                placeholder="client@example.com"
                className=""
                {...register("toEmail")}
              />

              <FieldError errors={[errors.toEmail]} />
            </Field>

            <Field data-invalid={!!errors.subject}>
              <FieldTitle>Subject</FieldTitle>
              <Input
                placeholder="Invoice subject"
                className=""
                {...register("subject")}
              />

              <FieldError errors={[errors.subject]} />
            </Field>

            <Field data-invalid={!!errors.message}>
              <FieldTitle>Message</FieldTitle>
              <ScrollArea className="h-48">
                <Textarea
                  placeholder="Write a custom message..."
                  className="min-h-48 resize-none "
                  {...register("message")}
                />
              </ScrollArea>

              <FieldError errors={[errors.message]} />
            </Field>

            <Label
              htmlFor="attach-pdf-checkbox"
              className="flex flex-row items-center justify-between space-y-0 rounded-lg border border-border bg-background p-4 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-semibold text-foreground">
                  Attach PDF
                </div>

                <div className="text-[12px] text-muted-foreground font-medium flex items-start gap-1.5">
                  Include the generated invoice as a PDF attachment
                </div>
              </div>

              <Checkbox
                id="attach-pdf-checkbox"
                checked={attachPdf}
                onCheckedChange={(checked) =>
                  setSendValue("attachPdf", !!checked)
                }
                className=""
              />
            </Label>
          </div>

          <SheetFooter className="space-y-2">
            <Button type="submit" className="" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Send Invoice
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className=""
            >
              Cancel
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
