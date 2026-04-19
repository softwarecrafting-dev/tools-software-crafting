"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceRecord } from "@/lib/db/repositories/types";
import { format } from "date-fns";
import { Download, Edit, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoicesTableProps {
  invoices: InvoiceRecord[];
}

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <div className="rounded-md border bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] font-semibold">Invoice #</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Issue Date</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="text-right font-semibold">Amount</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AnimatePresence mode="popLayout">
            {invoices.map((invoice, index) => (
              <motion.tr
                key={invoice.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  delay: Math.min(index * 0.05, 0.5),
                  ease: "easeOut",
                }}
                className="group border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
              >
                <TableCell className="font-medium align-middle">
                  {invoice.invoiceNumber}
                </TableCell>

                <TableCell className="align-middle">
                  <div className="flex flex-col">
                    <span className="font-medium">{invoice.clientName}</span>
                    <span className="text-xs text-muted-foreground">
                      {invoice.clientEmail}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="align-middle">
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>

                <TableCell className="align-middle text-muted-foreground">
                  {format(new Date(invoice.issueDate!), "MMM dd, yyyy")}
                </TableCell>

                <TableCell className="align-middle text-muted-foreground">
                  {format(new Date(invoice.dueDate!), "MMM dd, yyyy")}
                </TableCell>

                <TableCell className="text-right align-middle font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: invoice.currency,
                  }).format(parseFloat(invoice.total))}
                </TableCell>

                <TableCell className="align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover:opacity-100 opacity-0 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className=" h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className=" h-4 w-4" />
                        View PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className=" h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Trash2 className=" h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
