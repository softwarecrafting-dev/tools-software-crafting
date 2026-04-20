"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Edit,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import * as React from "react";
import { memo, useState } from "react";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoicesTableProps {
  invoices: InvoiceRecord[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (field: string, order: "asc" | "desc") => void;
}

export const InvoicesTable = memo(function InvoicesTable({
  invoices,
  sortBy,
  sortOrder,
  onSortChange,
}: InvoicesTableProps) {
  const [rowSelection, setRowSelection] = useState({});

  const columns = React.useMemo<ColumnDef<InvoiceRecord>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "invoiceNumber",
        header: () => (
          <SortableHeader
            column="invoiceNumber"
            label="Invoice #"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSortChange}
          />
        ),
        cell: ({ row }) => (
          <Link
            href={`/invoices/${row.original.id}`}
            className="font-medium text-primary hover:underline underline-offset-4"
            onClick={(e) => e.stopPropagation()}
          >
            {row.getValue("invoiceNumber")}
          </Link>
        ),
      },
      {
        accessorKey: "clientName",
        header: () => (
          <SortableHeader
            column="clientName"
            label="Client"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSortChange}
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.clientName}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.original.clientEmail}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => (
          <SortableHeader
            column="status"
            label="Status"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSortChange}
          />
        ),
        cell: ({ row }) => (
          <InvoiceStatusBadge status={row.getValue("status")} />
        ),
      },
      {
        accessorKey: "issueDate",
        header: () => (
          <SortableHeader
            column="issueDate"
            label="Issue Date"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSortChange}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap">
            {format(new Date(row.getValue("issueDate")), "MMM dd, yyyy")}
          </span>
        ),
      },
      {
        accessorKey: "dueDate",
        header: () => (
          <SortableHeader
            column="dueDate"
            label="Due Date"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSortChange}
          />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap">
            {format(new Date(row.getValue("dueDate")), "MMM dd, yyyy")}
          </span>
        ),
      },
      {
        accessorKey: "total",
        header: () => (
          <SortableHeader
            column="total"
            label="Amount"
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSort={onSortChange}
          />
        ),
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: row.original.currency,
            }).format(parseFloat(row.getValue("total")))}
          </span>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => <RowActions invoice={row.original} />,
      },
    ],
    [sortBy, sortOrder, onSortChange],
  );

  const table = useReactTable({
    data: invoices,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <div className="relative space-y-4">
      <AnimatePresence>
        {selectedRowsCount > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="overflow-hidden"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                  {selectedRowsCount}
                </div>
                <p className="text-sm font-medium text-primary">
                  Invoices selected
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  Print
                </Button>
                <Button variant="destructive" size="sm" className="h-8 gap-2">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => table.resetRowSelection()}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-md border bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/80 hover:bg-muted/80"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout" initial={false}>
              {table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.2,
                    delay: Math.min(index * 0.03, 0.3),
                    ease: "easeOut",
                  }}
                  className="group border-b transition-colors hover:bg-muted/40 data-[state=selected]:bg-primary/5 cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    // TODO
                    window.location.href = `/invoices/${row.original.id}`;
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
            {!invoices.length && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

function SortableHeader({
  column,
  label,
  currentSort,
  currentOrder,
  onSort,
}: {
  column: string;
  label: string;
  currentSort: string;
  currentOrder: "asc" | "desc";
  onSort: (field: string, order: "asc" | "desc") => void;
}) {
  const isActive = currentSort === column;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newOrder = isActive && currentOrder === "desc" ? "asc" : "desc";
    onSort(column, newOrder);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent font-semibold"
      onClick={handleClick}
    >
      <span>{label}</span>
      <AnimatePresence mode="wait">
        {isActive ? (
          <motion.span
            key={currentOrder}
            initial={{
              opacity: 0,
              scale: 0.5,
              rotate: currentOrder === "asc" ? -180 : 180,
            }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{
              opacity: 0,
              scale: 0.5,
              rotate: currentOrder === "asc" ? 180 : -180,
            }}
            transition={{ duration: 0.2 }}
            className="ml-2"
          >
            {currentOrder === "asc" ? (
              <ArrowUp className="h-4 w-4 text-primary" />
            ) : (
              <ArrowDown className="h-4 w-4 text-primary" />
            )}
          </motion.span>
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
        )}
      </AnimatePresence>
    </Button>
  );
}

function RowActions({ invoice: _invoice }: { invoice: InvoiceRecord }) {
  return (
    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link
              href={`/invoices/${_invoice.id}/edit`}
              className="flex w-full items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Edit className=" h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <FileText className=" h-4 w-4" />
            View PDF
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Download className=" h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className=" h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
