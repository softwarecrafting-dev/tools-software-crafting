import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OnboardingSkeleton() {
  return (
    <Card className="border-border/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4 px-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center flex-1 relative">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="mt-2 space-y-1 hidden sm:block">
                <Skeleton className="h-2 w-12 mx-auto" />
                <Skeleton className="h-2 w-8 mx-auto" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-1 w-full rounded-full" />

        <div className="mt-6">
          <Skeleton className="h-7 w-48 mb-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
