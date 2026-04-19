"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-user";
import {
  Activity,
  PanelLeftClose,
  PanelRightClose,
  Search,
} from "lucide-react";
import { useState } from "react";
import { ActivitySheet } from "./activity-sheet";
import { CommandMenu } from "./command-menu";
import { LanguageSelector } from "./language-selector";
import { NotificationsPopover } from "./notifications-popover";
import { SearchPlaceholder } from "./search-placeholder";
import { UserNav } from "./user-nav";

export function DashboardHeader() {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: user, isLoading } = useUser();
  const [open, setOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);

  return (
    <header className="w-full ">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="default"
            size="icon"
            className="bg-accent text-foreground"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <PanelRightClose className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>

          <div className="flex flex-col gap-1">
            <h1 className="font-semibold leading-none">
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                `Hey, ${user?.name?.split(" ")[0] || "User"}`
              )}
            </h1>
            <div className="hidden text-xs md:block">
              {isLoading ? (
                <Skeleton className="h-3 w-32" />
              ) : (
                "Welcome back to dashboard"
              )}
            </div>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center px-4 max-w-md md:flex">
          <SearchPlaceholder onOpen={() => setOpen(true)} />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground md:hidden"
                  onClick={() => setOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>

            <LanguageSelector />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground"
                  onClick={() => setActivityOpen(true)}
                >
                  <Activity className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Activity</TooltipContent>
            </Tooltip>

            <NotificationsPopover />
          </div>

          <ThemeToggle />
          <UserNav user={user} isLoading={isLoading} />
        </div>
      </div>

      <CommandMenu open={open} onOpenChange={setOpen} />
      <ActivitySheet open={activityOpen} onOpenChange={setActivityOpen} />
    </header>
  );
}
