"use client";

import { Button } from "@/components/ui/button";
import { EnhancedInput } from "@/components/ui/enhanced-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useInvoices } from "@/hooks/use-invoices";
import { type InvoiceStatus } from "@/lib/validators/invoice";
import { FileDown, FilterX, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { InvoicesTable } from "./invoices-table";

export function InvoicesClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [limit] = useState(10);

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    isError,
    isPlaceholderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInvoices({
    search: debouncedSearch || undefined,
    status: status === "all" ? undefined : status,
    limit,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const allInvoices = data?.pages.flatMap((page) => page.items) ?? [];

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  if (isError) {
    throw new Error("Failed to load invoices");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 max-w-sm">
          <EnhancedInput
            placeholder="Search by client or invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            isLoading={isFetching && debouncedSearch !== search}
            kbd="⌘f"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as InvoiceStatus | "all")}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={clearFilters}
            disabled={search === "" && status === "all"}
          >
            <FilterX className="h-4 w-4" />
          </Button>

          <Button variant="outline" className="hidden md:flex">
            <FileDown className=" h-4 w-4" />
            Export
          </Button>

          <Button className="shadow-sm hover:shadow-md transition-all">
            <Plus className=" h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading && !isPlaceholderData ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="rounded-md border p-8 text-center space-y-4">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </motion.div>
        ) : allInvoices.length > 0 ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <InvoicesTable invoices={allInvoices} />

            <div className="flex flex-col items-center justify-center space-y-4">
              <InfiniteScrollTrigger
                onIntersect={() => fetchNextPage()}
                hasNextPage={!!hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />

              <p className="text-sm text-muted-foreground text-center">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {allInvoices.length}
                </span>{" "}
                invoices
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-[350px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/30"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No invoices found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs text-center">
              Try adjusting your filters or search terms to find what
              you&apos;re looking for.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
