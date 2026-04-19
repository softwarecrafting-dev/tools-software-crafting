"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { LoaderCircle, LogOut, TriangleAlertIcon } from "lucide-react";

interface LogoutDialogProps {
  isCollapsed?: boolean;
}

export function LogoutDialog({ isCollapsed }: LogoutDialogProps) {
  const { mutate: logout, isPending } = useLogout();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center px-0",
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader className="items-center text-center">
          <div className="bg-destructive/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-destructive size-6" />
          </div>

          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account. You can sign back in at any
            time.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            variant={"destructive"}
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <LoaderCircle className=" h-4 w-4 animate-spin" />
            ) : null}
            {isPending ? "Logging out..." : "Log out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
