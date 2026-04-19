"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLogout } from "@/hooks/use-auth";
import { SafeUser } from "@/lib/db/repositories/types";
import {
  LogOut as LogOutIcon,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";

interface UserNavProps {
  user?: SafeUser | null;
  isLoading?: boolean;
}

export function UserNav({ user, isLoading }: UserNavProps) {
  const logout = useLogout();
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "JD";

  if (isLoading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full p-0 overflow-hidden ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={
                user?.avatarUrl ||
                "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
              }
              alt={user?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-60 p-2 shadow-2xl rounded-2xl"
        align="end"
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 rounded-full border border-border/10">
                <AvatarImage
                  src={
                    user?.avatarUrl ||
                    "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
                  }
                  alt={user?.name || "User"}
                  className="object-cover"
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-popover" />
            </div>

            <div className="flex flex-col space-y-0.5 min-w-0">
              <p className="text-sm font-bold leading-none truncate">
                {user?.name || "John Doe"}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email || "john.doe@example.com"}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2 opacity-50" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="rounded-lg px-2 py-1.5 cursor-pointer">
            <UserIcon className=" h-4 w-4 opacity-60" />
            <span>My account</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-lg px-2 py-1.5 cursor-pointer">
            <SettingsIcon className=" h-4 w-4 opacity-60" />
            <span>Settings</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="rounded-lg px-2 py-1.5 cursor-pointer">
            <CreditCardIcon className=" h-4 w-4 opacity-60" />
            <span>Billing</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 opacity-50" />

        {/* <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="rounded-lg px-2 py-1.5 cursor-pointer">
            <UsersIcon className=" h-4 w-4 opacity-60" />
            <span>Manage team</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="rounded-lg px-2 py-1.5 cursor-pointer">
            <Settings2Icon className=" h-4 w-4 opacity-60" />
            <span>Customization</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg px-2 py-1.5 cursor-pointer">
            <UserPlusIcon className=" h-4 w-4 opacity-60" />
            <span>Add team account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}

        <DropdownMenuSeparator className="my-2 opacity-50" />

        <DropdownMenuItem onClick={() => logout.mutate()} variant="destructive">
          <LogOutIcon className=" h-4 w-4" />
          <span className="font-semibold">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserNav;
