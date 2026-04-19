import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-32" />
            <Skeleton className="mt-2 h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card p-6 shadow-sm h-[350px]">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-8 h-full w-full" />
        </div>
        <div className="col-span-3 rounded-xl border bg-card p-6 shadow-sm h-[350px]">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="mt-8 h-full w-full" />
        </div>
      </div>
    </div>
  );
}
