import type { Metadata } from "next";
import { InvoiceCreateClient } from "./components/invoice-create-client";

export const metadata: Metadata = {
  title: "Create Invoice | SoftwareCrafting Tools",
  description:
    "Create a new invoice with live preview, itemised line items, and one-click sending.",
};

export default function InvoiceCreatePage() {
  return <InvoiceCreateClient />;
}
