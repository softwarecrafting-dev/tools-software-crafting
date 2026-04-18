import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function VerifyPromptNotFound() {
  return (
    <div className="w-full max-w-lg">
      <div className="rounded-xl border border-border/60 bg-card shadow-lg p-8 text-center space-y-6">
        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Not Found</h1>
          <p className="text-muted-foreground text-sm">
            The verification prompt could not be found. It might have been moved
            or deleted.
          </p>
        </div>

        <Button asChild className="w-full">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    </div>
  );
}
