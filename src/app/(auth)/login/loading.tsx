import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-lg border-border/60">
        <CardHeader className="text-center space-y-3">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </CardFooter>
      </Card>
    </div>
  );
}
