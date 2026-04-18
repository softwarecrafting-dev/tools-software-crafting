import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function VerifyEmailNotFound() {
  return (
    <div className="w-full max-w-lg">
      <Card className="shadow-lg border-border/60 text-center">
        <CardHeader className="space-y-1 items-center">
          <div className="mb-4 rounded-full mx-auto bg-muted p-3">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Link Not Found</CardTitle>
          <CardDescription>
            The verification link you are looking for does not exist or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            It might have been moved or deleted. Please check your email for the
            correct link.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
