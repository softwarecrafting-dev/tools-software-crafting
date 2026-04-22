"use client";

import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InvoiceFormValues } from "../invoice-form";
import { formatCurrency, formatPreviewDate, PreviewQRCode, PreviewStatusBadge } from "./components";

export function MinimalPreview({ data }: { data: InvoiceFormValues }) {
  return (
    <div className="p-12 h-full flex flex-col">
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4">
          {data.logoUrl && (
            <div className="mb-6">
              <img src={data.logoUrl} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />
            </div>
          )}
          {data.fromName && <h1 className="text-2xl font-bold tracking-tight">{data.fromName}</h1>}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{data.fromAddress}</p>
            <p>{data.fromEmail}</p>
            <p>{data.fromGstin && `GSTIN: ${data.fromGstin}`}</p>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="flex items-center justify-end gap-3">
             <PreviewStatusBadge status="draft" />
             <h2 className="text-3xl font-light text-muted-foreground/30 uppercase tracking-widest">Invoice</h2>
          </div>
          <p className="text-sm font-bold">#{data.invoiceNumber || "---"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bill To</h3>
          <div className="text-sm space-y-1">
            <p className="font-bold text-base">{data.clientName || "Client Name"}</p>
            <p>{data.clientCompany}</p>
            <p className="text-muted-foreground whitespace-pre-line">{data.clientAddress}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Issue Date</p>
            <p>{formatPreviewDate(data.issueDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Due Date</p>
            <p>{formatPreviewDate(data.dueDate)}</p>
          </div>
          <div className="col-span-2 space-y-1 pt-4">
             <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Currency</p>
             <p>{data.currency}</p>
          </div>
        </div>
      </div>

      <div className="grow">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-muted">
              <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest px-0">Description</TableHead>
              <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest text-right">Qty</TableHead>
              <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest text-right">Rate</TableHead>
              <TableHead className="text-muted-foreground uppercase text-[10px] font-bold tracking-widest text-right pr-0">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.lineItems || []).map((item) => (
              <TableRow key={item.id} className="border-muted/50 hover:bg-transparent">
                <TableCell className="px-0 py-4 align-top">
                  <p className="font-bold">{item.name}</p>
                  {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                </TableCell>
                <TableCell className="text-right py-4 align-top">{item.quantity} {item.unit}</TableCell>
                <TableCell className="text-right py-4 align-top">{formatCurrency(item.rate, data.currency)}</TableCell>
                <TableCell className="text-right font-bold py-4 align-top pr-0">{formatCurrency(item.amount, data.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12 flex justify-between items-end">
        <div className="space-y-6 grow">
          {data.upiId && <PreviewQRCode upiId={data.upiId} businessName={data.fromName} total={data.total} currency={data.currency} />}
          {data.notes && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Notes</h3>
              <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line">{data.notes}</p>
            </div>
          )}
        </div>
        
        <div className="w-[300px] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(data.subtotal, data.currency)}</span>
          </div>
          {data.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-destructive font-medium">
              <span>Discount</span>
              <span>-{formatCurrency(data.discountAmount, data.currency)}</span>
            </div>
          )}
          {data.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{data.taxLabel || "Tax"} ({data.taxRate}%)</span>
              <span>{formatCurrency(data.taxAmount, data.currency)}</span>
            </div>
          )}
          <Separator className="bg-border" />
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold uppercase tracking-widest text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(data.total, data.currency)}</span>
          </div>
          {data.signatureUrl && (
            <div className="pt-12 text-right">
              <img src={data.signatureUrl} alt="Signature" className="max-h-16 ml-auto object-contain" />
              <div className="mt-2 border-t border-border pt-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Authorized Signature</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
