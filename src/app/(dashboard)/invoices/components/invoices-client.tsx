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
import { ApiError } from "@/lib/api-client";
import {
  type InvoiceFiltersInput,
  type InvoiceStatus,
} from "@/lib/validators/invoice";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Clock,
  FileDown,
  FileJson,
  FileSpreadsheet,
  FileText,
  FilterX,
  Lock,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  ServerCrash,
  WifiOff,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { memo, useCallback, useDeferredValue, useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "./date-picker-with-range";
import { InfiniteScrollTrigger } from "./infinite-scroll-trigger";
import { InvoicesTable } from "./invoices-table";

export function InvoicesClient() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
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

  const debouncedSearch = useDebounce(deferredSearch, 400);

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
    error,
    isPlaceholderData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
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
    () =>
      data?.pages.flatMap((page) => page.data.items.filter(Boolean)) ?? [],
    [data],
  );

  const handleSearchChange = useCallback(
    (value: string) => setSearch(value),
    [],
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setDateRange(undefined);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2 max-w-2xl">
          <div className="flex-1 max-w-sm">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              isLoading={
                isFetching ||
                debouncedSearch !== deferredSearch ||
                deferredSearch !== search
              }
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

          <Link href="/invoices/new">
            <Button className="shadow-sm hover:shadow-md transition-all shrink-0">
              <Plus className=" h-4 w-4" />
              New Invoice
            </Button>
          </Link>
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
        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <InlineError
              error={error}
              onRetry={() => void refetch()}
              isRetrying={isFetching}
            />
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

const SearchInput = memo(function SearchInput({
  value,
  onChange,
  isLoading,
}: {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}) {
  return (
    <EnhancedInput
      placeholder="Search by client or invoice #..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClear={() => onChange("")}
      isLoading={isLoading}
      kbd="⌘f"
    />
  );
});

function InlineError({
  error,
  onRetry,
  isRetrying,
}: {
  error: unknown;
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  const apiError = error instanceof ApiError ? error : null;
  const status = apiError?.status ?? 0;
  const code = apiError?.code ?? "UNKNOWN_ERROR";
  const serverMessage = apiError?.message;

  const config: Record<
    string,
    { icon: ReactNode; title: string; hint: string }
  > = {
    RATE_LIMITED: {
      icon: <Clock className="h-8 w-8 text-amber-500" />,
      title: "Slow down a little",
      hint: "You've made too many requests in a short time. Wait a moment and try again.",
    },
    UNAUTHORIZED: {
      icon: <Lock className="h-8 w-8 text-destructive" />,
      title: "Session expired",
      hint: "Your session may have expired. Please refresh the page or sign in again.",
    },
    FORBIDDEN: {
      icon: <Lock className="h-8 w-8 text-destructive" />,
      title: "Access denied",
      hint: "You don't have permission to view these invoices.",
    },
    NETWORK_ERROR: {
      icon: <WifiOff className="h-8 w-8 text-muted-foreground" />,
      title: "No connection",
      hint: "Check your internet connection and try again.",
    },
    INTERNAL_ERROR: {
      icon: <ServerCrash className="h-8 w-8 text-destructive" />,
      title: "Server error",
      hint: "Something went wrong on our end. We're on it — try again in a moment.",
    },
  };

  const resolvedCode =
    status === 429
      ? "RATE_LIMITED"
      : status === 401
        ? "UNAUTHORIZED"
        : status === 403
          ? "FORBIDDEN"
          : status === 0
            ? "NETWORK_ERROR"
            : status >= 500
              ? "INTERNAL_ERROR"
              : code;

  const { icon, title, hint } = config[resolvedCode] ?? {
    icon: <AlertCircle className="h-8 w-8 text-destructive" />,
    title: "Failed to load invoices",
    hint: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="flex h-[350px] flex-col items-center justify-center rounded-lg border border-dashed bg-card/30">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center gap-3 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
          {icon}
        </div>

        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

        {serverMessage && serverMessage !== hint && (
          <p className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-md border">
            {serverMessage}
          </p>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">{hint}</p>

        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-2 gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          {isRetrying ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="h-4 w-4" />
          )}
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      </div>
    </div>
  );
}
