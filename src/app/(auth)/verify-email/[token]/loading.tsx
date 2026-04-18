import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailLoading() {
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-lg border-border/60 text-center">
        <CardHeader className="space-y-4 items-center">
          <Skeleton className="mx-auto h-14 w-14 rounded-full" />
          <div className="space-y-3 w-full">
            <Skeleton className="mx-auto h-8 w-48" />
            <div className="space-y-2 pt-1 w-full justify-center flex flex-col items-center">
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
