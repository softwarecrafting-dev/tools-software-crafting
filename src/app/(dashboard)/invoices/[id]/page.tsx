"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Construction } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] p-4">
      <Card className="w-full max-w-md ">
        <CardHeader className="flex flex-col items-center gap-4 text-center pb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
            <Construction className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Invoice Detail
            </CardTitle>

            <CardDescription className="text-sm text-muted-foreground">
              Detailed view for invoice{" "}
              <span className="font-mono text-foreground font-medium underline underline-offset-4 decoration-primary/30">
                {params.id}
              </span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="text-center pb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This module is currently under construction. You&apos;ll be able to
            manage, track, and generate PDFs for this invoice soon.
          </p>
        </CardContent>

        <CardFooter className="flex justify-center ">
          <Button
            variant="outline"
            className=""
            onClick={() => router.push("/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
