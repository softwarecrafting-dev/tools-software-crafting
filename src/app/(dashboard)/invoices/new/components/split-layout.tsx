"use client";

import { FormCTABar } from "./form-cta-bar";
import { FormPlaceholder } from "./form-placeholder";
import { PreviewPlaceholder } from "./preview-placeholder";

const FORM_SECTIONS = [
  {
    section: 1,
    title: "Invoice Meta",
    description: "Invoice number, dates, payment terms, currency",
    fields: ["Invoice Number", "Issue Date", "Due Date", "Currency"],
  },
  {
    section: 2,
    title: "Bill From",
    description: "Your business details (pre-filled from Settings)",
    fields: ["Business Name", "Address", "Email", "GSTIN / PAN"],
  },
  {
    section: 3,
    title: "Bill To",
    description: "Client details with autocomplete",
    fields: ["Client Name", "Email", "Company", "Address"],
  },
  {
    section: 4,
    title: "Line Items",
    description: "Draggable, auto-calculated rows",
    fields: ["Item Name", "Qty", "Unit", "Rate", "Amount"],
  },
  {
    section: 5,
    title: "Totals",
    description: "Discount, tax, and final total",
    fields: ["Subtotal", "Discount", "Tax", "Total"],
  },
  {
    section: 6,
    title: "Payment Details",
    description: "Bank account and UPI info",
    fields: ["Bank Name", "Account No.", "IFSC / UPI / SWIFT"],
  },
  {
    section: 7,
    title: "Notes & Terms",
    description: "Optional client notes and T&C",
    fields: ["Notes to Client", "Terms & Conditions"],
  },
  {
    section: 8,
    title: "Attachments",
    description: "Upload supporting documents (PDF, PNG, JPEG)",
    fields: ["Drag & drop or click to upload"],
  },
] as const;

interface SplitLayoutProps {
  nextInvoiceNumber: string | undefined;
}

export function SplitLayout({ nextInvoiceNumber }: SplitLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-0 h-full">
      <div
        id="form-column"
        className="overflow-y-auto border-r"
        style={{ maxHeight: "calc(100vh - 4rem - 65px)" }}
      >
        <div className="p-6 pb-4 space-y-4">
          {FORM_SECTIONS.map(({ section, title, description, fields }) => (
            <FormPlaceholder
              key={section}
              section={section}
              title={title}
              description={description}
              fields={[...fields]}
              nextInvoiceNumber={section === 1 ? nextInvoiceNumber : undefined}
            />
          ))}
        </div>

        <FormCTABar />
      </div>

      <div
        id="preview-column"
        className="hidden md:flex flex-col overflow-hidden"
        style={{ maxHeight: "calc(100vh - 4rem - 65px)" }}
      >
        <PreviewPlaceholder />
      </div>
    </div>
  );
}
