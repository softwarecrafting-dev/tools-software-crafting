"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  UserIcon, 
  SettingsIcon, 
  CreditCardIcon, 
  UsersIcon, 
  PaletteIcon, 
  PlusIcon, 
} from "lucide-react";
import Link from "next/link";
import { LogoutDialog } from "@/components/ui/logout-dialog";

interface UserNavProps {
  user: {
    name?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-xl bg-[#e5e5e5] p-2 hover:bg-[#d5d5d5]">
          <Avatar className="h-full w-full rounded-lg">
            <AvatarImage src={user.avatarUrl || ""} alt={user.name || "User"} />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 px-1 py-1.5">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl || ""} alt={user.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold leading-none">{user.name || "User"}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex w-full items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>My account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex w-full items-center">
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex w-full items-center">
              <CreditCardIcon className="mr-2 h-4 w-4" />
              <span>Billing</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mx-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/team" className="flex w-full items-center">
              <UsersIcon className="mr-2 h-4 w-4" />
              <span>Manage team</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/customize" className="flex w-full items-center">
              <PaletteIcon className="mr-2 h-4 w-4" />
              <span>Customization</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/team/new" className="flex w-full items-center">
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>Add team account</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="mx-1" />
        <DropdownMenuItem asChild>
          <LogoutDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
