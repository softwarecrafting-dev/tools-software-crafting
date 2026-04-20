"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

interface InfiniteScrollTriggerProps {
  onIntersect: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

const TableRowSkeleton = () => (
  <TableRow className="hover:bg-transparent border-b">
    <TableCell className="px-4 py-3 w-[50px]">
      <Skeleton className="h-4 w-4 rounded" />
    </TableCell>
    <TableCell className="px-4 py-3 w-[120px]">
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell className="px-4 py-3">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </TableCell>
    <TableCell className="px-4 py-3">
      <Skeleton className="h-6 w-16 rounded-full" />
    </TableCell>
    <TableCell className="px-4 py-3">
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell className="px-4 py-3">
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell className="px-4 py-3">
      <Skeleton className="h-4 w-20 " />
    </TableCell>
    <TableCell className="px-4 py-3 w-[80px] text-right">
      <Skeleton className="h-8 w-8 rounded-md ml-auto" />
    </TableCell>
  </TableRow>
);

export function InfiniteScrollTrigger({
  onIntersect,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onIntersect();
        }
      },
      { threshold: 0.1 },
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, hasNextPage, isFetchingNextPage]);

  return (
    <div ref={triggerRef} className="w-full">
      <AnimatePresence mode="wait">
        {isFetchingNextPage ? (
          <motion.div
            key="loading-skeletons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-x border-b rounded-b-md bg-card/50 overflow-hidden"
          >
            <Table className="table-fixed w-full">
              <TableBody>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </TableBody>
            </Table>
          </motion.div>
        ) : (
          !hasNextPage && (
            <motion.div
              key="end-of-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4 flex items-center justify-center text-sm text-muted-foreground italic"
            >
              End of list
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
