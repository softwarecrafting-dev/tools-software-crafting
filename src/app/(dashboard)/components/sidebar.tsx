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
import { LogoutDialog } from "@/components/ui/logout-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/user";
import {
  BellIcon,
  CreditCardIcon,
  FileText,
  LayoutDashboard,
  PanelRightClose,
  PanelRightOpen,
  Settings,
  SettingsIcon,
  UserIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface SidebarProps {
  className?: string;
  user: {
    name?: string | null;
    email: string;
    avatarUrl?: string | null;
  };
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ className, user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const initials = getInitials(user.name, user.email);

  const userMenuItems = [
    { icon: UserIcon, label: "Profile", href: "/settings" },
    { icon: SettingsIcon, label: "Settings", href: "/settings" },
    { icon: CreditCardIcon, label: "Billing", href: "/settings" },
    { icon: BellIcon, label: "Notifications", href: "/settings" },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-muted/10 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div className="flex h-16 items-center justify-between px-6">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-primary">
            SoftwareCrafting
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "h-5 w-5 text-muted-foreground",
                isCollapsed && "mx-auto",
              )}
            >
              {isCollapsed ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-4">
        {navItems.map((item) => (
          <React.Fragment key={item.href}>
            {item.title === "Settings" && (
              <Separator className="my-2 bg-muted-foreground/20" />
            )}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname.startsWith(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  <item.icon
                    className={cn("h-4 w-4", !isCollapsed && "mr-1")}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {item.title}
                </TooltipContent>
              )}
            </Tooltip>
          </React.Fragment>
        ))}
      </nav>

      <div className="border-t p-3 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex h-auto w-full items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ",
                isCollapsed && "justify-center px-0",
              )}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user.avatarUrl || ""}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-col gap-1 text-start leading-none flex-1 overflow-hidden">
                  <span className="truncate text-sm font-semibold">
                    {user.name || "User"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64" side="right">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {userMenuItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <LogoutDialog isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
