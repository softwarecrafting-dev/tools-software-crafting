"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  Inbox,
  Link as LinkIcon,
  RefreshCcw,
  Settings,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const NotificationItemWrapper = ({
  avatar,
  name,
  timestamp,
  subtitle,
  children,
  isUnread = false,
  onClose,
  index,
}: {
  avatar: string;
  name: string;
  timestamp: string;
  subtitle: string;
  children?: React.ReactNode;
  isUnread?: boolean;
  onClose?: () => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className={cn(
      "group relative flex gap-3 px-4 py-4 transition-colors hover:bg-muted/30",
      isUnread && "bg-muted/10",
    )}
  >
    <Avatar className="h-10 w-10 shrink-0 border border-border/50">
      <AvatarImage src={avatar} />
      <AvatarFallback className="text-xs bg-muted">
        {name.charAt(0)}
      </AvatarFallback>
    </Avatar>

    <div className="flex flex-1 flex-col min-w-0">
      <div className="flex items-center justify-between gap-1">
        <span className="text-sm font-bold text-foreground truncate">
          {name}
        </span>
        <div className="flex items-center gap-2">
          {isUnread && (
            <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
          )}

          <button
            onClick={onClose}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-muted rounded-sm"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[11px] text-muted-foreground">{timestamp}</span>
        <span className="text-[11px] text-muted-foreground/40">•</span>
        <span className="text-[11px] text-muted-foreground">{subtitle}</span>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  </motion.div>
);

const ActionButtons = ({
  onDecline,
  onAccept,
}: {
  onDecline?: () => void;
  onAccept?: () => void;
}) => (
  <div className="flex items-center gap-2">
    <Button
      variant="secondary"
      size="sm"
      className="h-8 px-4 text-xs font-bold rounded-lg bg-muted/60 hover:bg-muted border-none"
      onClick={onDecline}
    >
      Decline
    </Button>

    <Button
      variant="default"
      size="sm"
      className="h-8 px-4 text-xs font-bold rounded-lg bg-foreground text-background hover:opacity-90 border-none"
      onClick={onAccept}
    >
      Accept
    </Button>
  </div>
);

const AttachedFile = ({ url }: { url: string }) => (
  <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group w-fit">
    <LinkIcon className="h-3.5 w-3.5" />
    <span className="text-[11px] font-medium border-b border-transparent group-hover:border-foreground/20">
      {url}
    </span>
  </div>
);

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-[350px] p-8 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground/30" />
      </div>

      <h3 className="text-sm font-semibold mb-1 text-foreground">
        No notifications yet
      </h3>

      <p className="text-xs text-muted-foreground max-w-[200px]">
        We&apos;ll notify you when something important happens.
      </p>
    </motion.div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-[350px] p-8 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h3 className="text-sm font-semibold mb-1 text-destructive">
        Failed to load
      </h3>

      <p className="text-xs text-muted-foreground mb-4">
        Something went wrong while fetching notifications.
      </p>

      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCcw className="h-3 w-3" />
        Retry
      </Button>
    </motion.div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 px-4 py-4 border-b border-border/40 last:border-0"
        >
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

type NotificationStatus = "loading" | "error" | "empty" | "data";

function NotificationList({ type }: { type: "inbox" | "general" }) {
  const [status, setStatus] = useState<NotificationStatus>("loading");

  const loadData = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("data");
    }, 1200);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("data");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return <NotificationSkeleton />;
  }

  if (status === "empty") {
    return <EmptyState />;
  }

  if (status === "error") {
    return <ErrorState onRetry={loadData} />;
  }

  if (type === "inbox") {
    return (
      <motion.div
        key="inbox-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col divide-y divide-border/40"
      >
        <NotificationItemWrapper
          index={0}
          isUnread
          avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
          name="Mark Bush"
          timestamp="12 Minutes ago"
          subtitle="New post"
        />

        <NotificationItemWrapper
          index={1}
          isUnread
          avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png"
          name="Aaron Black"
          timestamp="27 Minutes ago"
          subtitle="New comment"
        />

        <NotificationItemWrapper
          index={2}
          avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png"
          name="Anna has applied to create an ad for your campaign"
          timestamp="2 hours ago"
          subtitle="New request for campaign"
        >
          <ActionButtons />
        </NotificationItemWrapper>

        <NotificationItemWrapper
          index={3}
          avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png"
          name="Jason attached the file"
          timestamp="6 hours ago"
          subtitle="Attached files"
        >
          <AttachedFile url="Work examples.com" />
        </NotificationItemWrapper>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="general-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col divide-y divide-border/40"
    >
      <NotificationItemWrapper
        index={0}
        isUnread
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
        name="Fred Campbell"
        timestamp="39 Minutes ago"
        subtitle="New comment"
      />

      <NotificationItemWrapper
        index={1}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png"
        name="Scott attached the file"
        timestamp="3 hours ago"
        subtitle="Attached files"
      >
        <AttachedFile url="Work examples.com" />
      </NotificationItemWrapper>

      <NotificationItemWrapper
        index={2}
        isUnread
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png"
        name="Harold Larson"
        timestamp="5 hours ago"
        subtitle="New post"
      />

      <NotificationItemWrapper
        index={3}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-8.png"
        name="Rosie has applied to create an ad for your campaign"
        timestamp="8 hours ago"
        subtitle="New request for campaign"
      >
        <ActionButtons />
      </NotificationItemWrapper>
    </motion.div>
  );
}

export function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inbox");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const tabs = ["inbox", "general"];
    const activeIndex = tabs.indexOf(activeTab);
    const activeTabElement = tabRefs.current[activeIndex];

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement;

      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground relative group"
          >
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase opacity-80">
              Notifications
            </span>
            <Badge
              variant="secondary"
              className="h-[18px] px-1.5 text-[10px] bg-muted/50 text-muted-foreground font-bold border-none rounded-[4px]"
            >
              8 New
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 ">
            <TabsList className="bg-background relative w-full justify-start rounded-none border-b p-0 gap-8">
              <TabsTrigger
                value="inbox"
                ref={(el) => {
                  tabRefs.current[0] = el;
                }}
                className="bg-background dark:data-[state=active]:bg-background relative z-10 rounded-none border-0 data-[state=active]:shadow-none!"
              >
                Inbox
              </TabsTrigger>
              <TabsTrigger
                value="general"
                ref={(el) => {
                  tabRefs.current[1] = el;
                }}
                className="bg-background dark:data-[state=active]:bg-background relative z-10 rounded-none border-0 data-[state=active]:shadow-none!"
              >
                General
              </TabsTrigger>

              <motion.div
                className="bg-primary absolute bottom-0 z-20 h-0.5"
                layoutId="underline"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 40,
                }}
              />
            </TabsList>
          </div>

          <div className="h-[420px]">
            <ScrollArea className="h-full w-full">
              <AnimatePresence mode="wait">
                {open && (
                  <div className="flex flex-col w-full">
                    <TabsContent
                      value="inbox"
                      className="m-0 focus-visible:outline-none"
                    >
                      <NotificationList key="inbox" type="inbox" />
                    </TabsContent>
                    <TabsContent
                      value="general"
                      className="m-0 focus-visible:outline-none"
                    >
                      <NotificationList key="general" type="general" />
                    </TabsContent>
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
