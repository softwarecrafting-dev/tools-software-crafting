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

export function ClassicPreview({ data }: { data: InvoiceFormValues }) {
  return (
    <div className="p-12 h-full flex flex-col font-serif  text-foreground">
      <div className="border-b-4 border-foreground pb-8 mb-8 flex justify-between items-end">
        <div>
          {data.logoUrl && (
            <div className="mb-4">
              <img
                src={data.logoUrl}
                alt="Logo"
                className="max-h-16 max-w-[150px] object-contain grayscale"
              />
            </div>
          )}
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">
            INVOICE
          </h1>
          <p className="text-muted-foreground font-sans font-bold">
            #{data.invoiceNumber || "---"}
          </p>
        </div>
        <div className="text-right font-sans">
          <p className="font-bold text-xl">{data.fromName}</p>
          <p className="text-sm text-muted-foreground">{data.fromEmail}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 mb-12 font-sans">
        <div className="space-y-4 col-span-2">
          <h3 className="text-[10px] font-black uppercase bg-foreground text-background px-2 py-0.5 w-fit">
            Bill To
          </h3>
          <div className="space-y-1">
            <p className="font-bold text-lg">
              {data.clientName || "Client Name"}
            </p>
            <p className="text-muted-foreground">{data.clientCompany}</p>
            <p className="text-muted-foreground text-sm whitespace-pre-line">
              {data.clientAddress}
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-muted-foreground">
              Issue Date
            </p>
            <p className="font-bold border-b border-border pb-1">
              {formatPreviewDate(data.issueDate)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase text-muted-foreground">
              Due Date
            </p>
            <p className="font-bold border-b border-border pb-1">
              {formatPreviewDate(data.dueDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="grow font-sans">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-y-2 border-foreground bg-muted/30 hover:bg-muted/30">
              <TableHead className="text-foreground uppercase text-xs font-black">
                Description
              </TableHead>
              <TableHead className="text-foreground uppercase text-xs font-black text-right">
                Qty
              </TableHead>
              <TableHead className="text-foreground uppercase text-xs font-black text-right">
                Rate
              </TableHead>
              <TableHead className="text-foreground uppercase text-xs font-black text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.lineItems || []).map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-border hover:bg-transparent"
              >
                <TableCell className="py-4">
                  <p className="font-bold">{item.name}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground italic">
                      {item.description}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.rate, data.currency)}
                </TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(item.amount, data.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12 flex justify-between font-sans">
        <div className="space-y-6">
          <PreviewQRCode
            upiId={data.upiId}
            businessName={data.fromName}
            total={data.total}
            currency={data.currency}
          />
          {data.notes && (
            <div className="max-w-[400px]">
              <h3 className="text-[10px] font-black uppercase text-muted-foreground mb-2">
                Terms & Notes
              </h3>
              <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                {data.notes}
              </p>
            </div>
          )}
        </div>

        <div className="w-[300px] border-t-4 border-foreground pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-bold">Subtotal</span>
            <span>{formatCurrency(data.subtotal, data.currency)}</span>
          </div>
          {data.discountAmount > 0 && (
            <div className="flex justify-between text-sm italic text-muted-foreground">
              <span>Discount (-)</span>
              <span>{formatCurrency(data.discountAmount, data.currency)}</span>
            </div>
          )}
          {data.taxAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span>
                {data.taxLabel || "Tax"} ({data.taxRate}%)
              </span>
              <span>{formatCurrency(data.taxAmount, data.currency)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 bg-foreground text-background px-4 py-3 mt-4">
            <span className="text-xs font-black uppercase">Total Amount</span>
            <span className="text-2xl font-black">
              {formatCurrency(data.total, data.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
