import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyPromptLoading() {
  return (
    <div className="w-full max-w-lg">
      <div className="rounded-xl border border-border/60 bg-card shadow-lg p-8 text-center space-y-6">
        <div className="space-y-4">
          <Skeleton className="mx-auto h-14 w-14 rounded-full" />
          <Skeleton className="mx-auto h-8 w-48" />
          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-full max-w-[300px]" />
            <Skeleton className="mx-auto h-4 w-full max-w-[250px]" />
          </div>
        </div>
        <Skeleton className="mx-auto h-10 w-full" />
        <div className="space-y-3 pt-4 border-t border-border/60">
          <Skeleton className="mx-auto h-4 w-[200px]" />
          <Skeleton className="mx-auto h-4 w-[250px]" />
        </div>
      </div>
    </div>
  );
}
