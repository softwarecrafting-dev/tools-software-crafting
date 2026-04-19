"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils/user";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  PlusIcon,
  ChevronRight,
  ChevronDown,
  CreditCardIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { motion, AnimatePresence } from "framer-motion";
import { LogoutDialog } from "@/components/ui/logout-dialog";

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
    title: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Wallet Management",
    href: "/wallet",
    icon: CreditCardIcon,
    children: [
      { title: "Account Overview", href: "/wallet/overview" },
      { title: "Available Funds", href: "/wallet/funds" },
      { title: "Transaction History", href: "/wallet/history" },
    ],
  },
  {
    title: "Deposit Funds",
    href: "/deposit",
    icon: PlusIcon,
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

const mockedRecipients = [
  { name: "Liam Anderson", avatar: "" },
  { name: "Emma Smith", avatar: "" },
  { name: "Ethan Bennett", avatar: "" },
  { name: "Olivia Morgan", avatar: "" },
];

export function Sidebar({ className, user }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [openMenus, setOpenMenus] = React.useState<string[]>(["Wallet Management"]);

  const initials = getInitials(user.name, user.email);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-72",
        className
      )}
    >
      <div className="flex h-20 items-center px-6 md:h-24">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight">
              SoftwareCrafting
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-none">
        <div className="space-y-6">
          <div>
            {!isCollapsed && (
              <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pages
              </h2>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <div key={item.title}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => item.children && toggleMenu(item.title)}
                        className={cn(
                          "group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent",
                          pathname.startsWith(item.href)
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground",
                          isCollapsed && "justify-center px-0"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            {item.children && (
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  openMenus.includes(item.title) ? "" : "-rotate-90"
                                )}
                              />
                            )}
                          </>
                        )}
                      </button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.title}</TooltipContent>
                    )}
                  </Tooltip>
                  <AnimatePresence>
                    {!isCollapsed && item.children && openMenus.includes(item.title) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-9 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.title}
                            href={child.href}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {child.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          <div>
            {!isCollapsed && (
              <h2 className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recipients
              </h2>
            )}
            <div className="space-y-1">
              {mockedRecipients.map((recipient) => (
                <button
                  key={recipient.name}
                  className={cn(
                    "group flex w-full items-center rounded-xl px-2 py-2 text-sm font-medium transition-all hover:bg-accent",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-[10px]">
                      {recipient.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <span className="ml-3 text-muted-foreground group-hover:text-foreground">
                      {recipient.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-xl px-2 py-2 hover:bg-accent",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden text-left">
                  <span className="w-full truncate text-sm font-semibold">
                    {user.name || "User"}
                  </span>
                  <span className="w-full truncate text-xs text-muted-foreground">
                    Admin
                  </span>
                </div>
              )}
              {!isCollapsed && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2" side="right">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1" />
            <DropdownMenuItem asChild>
              <LogoutDialog />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
