import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center animate-in zoom-in-95 duration-300">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          The dashboard tool or page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Button asChild variant="default">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}
