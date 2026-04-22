"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceFormValues } from "../invoice-form";
import { formatCurrency, formatPreviewDate, PreviewQRCode } from "./components";

export function ModernPreview({ data }: { data: InvoiceFormValues }) {
  return (
    <div className="p-0 h-full flex flex-col font-sans overflow-hidden  text-foreground">
      <div className="bg-foreground text-background p-12 flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Invoice</h1>
          <p className="text-muted-foreground font-medium">
            #{data.invoiceNumber || "---"}
          </p>
        </div>
        <div className="text-right">
          <div className="size-16 bg-background/10 rounded-2xl flex items-center justify-center border border-background/20 mb-4 ml-auto overflow-hidden">
            {data.logoUrl ? (
              <img
                src={data.logoUrl}
                alt="Logo"
                className="size-full object-contain p-2"
              />
            ) : (
              <span className="text-2xl font-black italic">
                {data.fromName?.charAt(0) || "S"}
              </span>
            )}
          </div>
          <p className="font-bold">{data.fromName}</p>
          <p className="text-xs text-muted-foreground">{data.fromEmail}</p>
        </div>
      </div>

      <div className="p-12 space-y-12 grow">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-muted/30 p-6 rounded-2xl border border-border flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">
              Bill To
            </span>
            <div className="space-y-1">
              <p className="font-bold text-foreground">
                {data.clientName || "Client Name"}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed truncate">
                {data.clientCompany}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed truncate">
                {data.clientEmail}
              </p>
            </div>
          </div>
          <div className="bg-muted/30 p-6 rounded-2xl border border-border flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">
              Date Issued
            </span>
            <p className="font-bold text-foreground">
              {formatPreviewDate(data.issueDate)}
            </p>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-4 block">
              Amount Due
            </span>
            <p className="font-black text-primary text-xl tracking-tight">
              {formatCurrency(data.total, data.currency)}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border">
                <TableHead className="text-foreground font-bold py-6 pl-8">
                  Item Description
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">
                  Rate
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-right pr-8">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data.lineItems || []).map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-muted/50 last:border-0 hover:bg-transparent"
                >
                  <TableCell className="py-6 pl-8">
                    <p className="font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.quantity} {item.unit}
                    </p>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-medium">
                    {formatCurrency(item.rate, data.currency)}
                  </TableCell>
                  <TableCell className="text-right font-bold text-foreground pr-8">
                    {formatCurrency(item.amount, data.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-start">
          <div className="space-y-6">
            {data.notes && (
              <div className="bg-muted/20 p-6 rounded-3xl border border-dashed border-border max-w-sm">
                <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">
                  {data.notes}
                </p>
              </div>
            )}
            <PreviewQRCode
              upiId={data.upiId}
              businessName={data.fromName}
              total={data.total}
              currency={data.currency}
            />
          </div>

          <div className="w-[320px] space-y-4">
            <div className="space-y-3 px-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">
                  Subtotal
                </span>
                <span className="text-foreground font-bold">
                  {formatCurrency(data.subtotal, data.currency)}
                </span>
              </div>
              {data.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount</span>
                  <span>
                    -{formatCurrency(data.discountAmount, data.currency)}
                  </span>
                </div>
              )}
              {data.taxAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    {data.taxLabel}
                  </span>
                  <span className="text-foreground font-bold">
                    {formatCurrency(data.taxAmount, data.currency)}
                  </span>
                </div>
              )}
            </div>
            <div className="bg-primary p-6 rounded-3xl text-primary-foreground shadow-lg shadow-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest opacity-70">
                  Final Total
                </span>
                <span className="text-2xl font-black tracking-tighter">
                  {formatCurrency(data.total, data.currency)}
                </span>
              </div>
            </div>
            {data.signatureUrl && (
              <div className="pt-8 text-right pr-4">
                <img
                  src={data.signatureUrl}
                  alt="Signature"
                  className="max-h-12 ml-auto object-contain"
                />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                  Authorized Signatory
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
