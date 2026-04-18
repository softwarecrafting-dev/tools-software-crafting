import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileQuestion, Home } from "lucide-react";
import Link from "next/link";

export default function OnboardingNotFound() {
  return (
    <Card className="shadow-lg border-border/60">
      <CardHeader className="text-center space-y-1">
        <div className="mb-4 rounded-full mx-auto bg-muted p-3 w-fit">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold">Setup Not Found</CardTitle>
        <CardDescription>
          The onboarding setup page you are looking for does not exist or has
          been moved.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/">
            <Home className=" h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
