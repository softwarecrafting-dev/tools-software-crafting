import { Button } from "@/components/ui/button";
import { FileX2 } from "lucide-react";
import Link from "next/link";

export default function InvoiceCreateNotFound() {
  return (
    <div className="flex h-[calc(100vh-8rem)] shrink-0 items-center justify-center rounded-xl border border-dashed bg-card/30 m-6">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
          <FileX2 className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="mt-6 text-xl font-semibold tracking-tight">
          Page not found
        </h3>

        <p className="mb-8 mt-2 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        <Button asChild variant="outline">
          <Link href="/invoices">Back to invoices</Link>
        </Button>
      </div>
    </div>
  );
}
