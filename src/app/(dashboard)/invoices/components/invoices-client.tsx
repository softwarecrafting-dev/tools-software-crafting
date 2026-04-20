"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnhancedInput } from "@/components/ui/enhanced-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useInvoices } from "@/hooks/use-invoices";
import {
  type InvoiceFiltersInput,
  type InvoiceStatus,
} from "@/lib/validators/invoice";
import {
  Check,
  ChevronsUpDown,
  FileDown,
  FileJson,
  FileSpreadsheet,
  FileText,
  FilterX,
  Plus,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState, useTransition } from "react";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./date-picker-with-range";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { InvoicesTable } from "./invoices-table";

export function InvoicesClient() {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortBy, setSortBy] =
    useState<InvoiceFiltersInput["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit] = useState(10);

  const statuses = [
    { label: "All Statuses", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Overdue", value: "overdue" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const debouncedSearch = useDebounce(search, 500);

  const handleSortChange = useCallback(
    (field: string, order: "asc" | "desc") => {
      setSortBy(field as InvoiceFiltersInput["sortBy"]);
      setSortOrder(order as "asc" | "desc");
    },
    [],
  );

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
    fromDate: dateRange?.from?.toISOString(),
    toDate: dateRange?.to?.toISOString(),
    limit,
    sortBy,
    sortOrder,
  });

  const allInvoices = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setDateRange(undefined);
  };

  if (isError) {
    throw new Error("Failed to load invoices");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-2xl">
          <div className="flex-1 max-w-sm">
            <EnhancedInput
              placeholder="Search by client or invoice #..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                startTransition(() => {
                  setSearch(value);
                });
              }}
              onClear={() => {
                startTransition(() => {
                  setSearch("");
                });
              }}
              isLoading={isFetching || debouncedSearch !== search || isPending}
              kbd="⌘f"
            />
          </div>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            className="hidden sm:block"
          />
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {(search !== "" || status !== "all" || dateRange !== undefined) && (
              <motion.div
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 0 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden shrink-0"
              >
                <Button variant="outline" onClick={clearFilters}>
                  <FilterX className="h-3.5 w-3.5" />
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="">
                {statuses.find((s) => s.value === status)?.label ?? "Status"}
                <ChevronsUpDown className=" h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[180px] p-1">
              <div className="flex flex-col">
                {statuses.map((item) => (
                  <button
                    key={item.value}
                    onClick={() =>
                      setStatus(item.value as InvoiceStatus | "all")
                    }
                    className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    {item.label}
                    {status === item.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden md:flex shrink-0">
                <FileDown className=" h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[150px]">
              <DropdownMenuItem className="cursor-pointer">
                <FileText className=" h-4 w-4" />
                <span>Export as CSV</span>
                {/* <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1 rounded">
                  TODO
                </span> */}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <FileSpreadsheet className=" h-4 w-4" />
                <span>Export as Excel</span>
                {/* <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1 rounded">
                  TODO
                </span> */}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <FileJson className=" h-4 w-4" />
                <span>Export as JSON</span>
                {/* <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1 rounded">
                  TODO
                </span> */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="shadow-sm hover:shadow-md transition-all shrink-0">
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
            <InvoicesTable
              invoices={allInvoices}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />

            <div className="flex flex-col items-center justify-center ">
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
