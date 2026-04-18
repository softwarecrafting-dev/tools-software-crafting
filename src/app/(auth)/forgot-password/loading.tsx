import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForgotPasswordLoading() {
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-lg border-border/60 text-center">
        <CardHeader className="space-y-4 items-center">
          <Skeleton className="mx-auto h-12 w-48" />
          <div className="space-y-3 w-full">
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-4 w-56" />
          </div>
        </CardHeader>
        <CardFooter>
          <Skeleton className="mx-auto h-10 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
}
