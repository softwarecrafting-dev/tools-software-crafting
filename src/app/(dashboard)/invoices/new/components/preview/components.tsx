"use client";

import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function PreviewQRCode({ 
  upiId, 
  businessName, 
  total, 
  currency 
}: { 
  upiId?: string | null; 
  businessName?: string | null; 
  total: number; 
  currency: string;
}) {
  if (!upiId || currency !== "INR") return null;

  const qrValue = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName || "Business")}&am=${total}&cu=INR`;

  return (
    <div className="flex flex-col items-center gap-2 p-2 border border-border rounded-lg bg-muted/30 w-fit">
      <QRCodeSVG value={qrValue} size={80} level="M" />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Scan to Pay</span>
    </div>
  );
}

export function PreviewStatusBadge({ status }: { status?: string }) {
  const s = status || "draft";
  return (
    <Badge variant="outline" className="capitalize font-semibold border-primary/20 bg-primary/5 text-primary">
      {s}
    </Badge>
  );
}

export function formatPreviewDate(dateStr?: string) {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "MMM dd, yyyy");
  } catch {
    return "-";
  }
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
