import { Metadata } from "next";
import { InvoicesClient } from "./components/invoices-client";

export const metadata: Metadata = {
  title: "Invoices | SoftwareCrafting Tools",
  description: "Manage your invoices, track payments, and generate PDFs.",
};

export default function InvoicesPage() {
  return (
    <div className="flex-1 space-y-4  ">
      <div className="flex items-center justify-between ">
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
      </div>

      <InvoicesClient />
    </div>
  );
}
