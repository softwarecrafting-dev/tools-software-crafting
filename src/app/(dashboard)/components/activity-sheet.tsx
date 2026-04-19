"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  FileText,
  History,
  ImageIcon,
  MessageSquareMore,
  RefreshCcw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const FigmaIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 38 57"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
  >
    <path
      d="M19 28.5C19 25.9834 20.0009 23.5699 21.7825 21.7883C23.5641 20.0067 25.9775 19.0058 28.4942 19.0058C31.0108 19.0058 33.4243 20.0067 35.2058 21.7883C36.9874 23.5699 37.9883 25.9834 37.9883 28.5C37.9883 31.0167 36.9874 33.4301 35.2058 35.2117C33.4243 36.9933 31.0108 37.9942 28.4942 37.9942C25.9775 37.9942 23.5641 36.9933 21.7825 35.2117C20.0009 33.4301 19 31.0167 19 28.5V28.5Z"
      fill="#1ABCFE"
    />
    <path
      d="M0 47.4942C0 44.9775 1.00085 42.5641 2.78247 40.7825C4.56408 39.0009 6.9775 38 9.49417 38H19V47.4942C19 50.0108 17.9991 52.4243 16.2175 54.2058C14.4359 55.9875 12.0225 56.9883 9.49583 56.9883C6.97917 56.9883 4.56575 55.9875 2.78413 54.2058C1.00251 52.4243 0.00166667 50.0108 0 47.4942V47.4942Z"
      fill="#0ACF83"
    />
    <path
      d="M0 28.5C0 25.9834 1.00085 23.5699 2.78247 21.7883C4.56408 20.0067 6.9775 19.0058 9.49417 19.0058H19V38H9.49417C6.9775 38 4.56408 36.9991 2.78247 35.2175C1.00085 33.4359 0 31.0225 0 28.5V28.5Z"
      fill="#A259FF"
    />
    <path
      d="M0 9.5C0 6.98335 1.00085 4.56992 2.78247 2.7883C4.56408 1.00668 6.9775 0.00583333 9.49417 0.00583333H19V19H9.49417C6.9775 19 4.56408 17.9991 2.78247 16.2175C1.00085 14.4359 0 12.0225 0 9.5V9.5Z"
      fill="#F24E1E"
    />
    <path
      d="M19 0.00583333H28.4942C31.0108 0.00583333 33.4243 1.00668 35.2058 2.7883C36.9874 4.56992 37.9883 6.98335 37.9883 9.5C37.9883 12.0167 36.9874 14.4301 35.2058 16.2117C33.4243 17.9933 31.0108 18.9942 28.4958 18.9942H19V0.00583333Z"
      fill="#FF7262"
    />
  </svg>
);

const ActivityItemWrapper = ({
  avatar,
  name,
  subtitle,
  timestamp,
  children,
  index,
}: {
  avatar: string;
  name: string;
  subtitle: string;
  timestamp: string;
  children?: React.ReactNode;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex gap-3 px-4 py-5 border-b border-border/40 last:border-0"
  >
    <Avatar className="h-9 w-9 border border-border/50 shrink-0">
      <AvatarImage src={avatar} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>

    <div className="flex flex-col flex-1 min-w-0">
      <div className="flex flex-col gap-0.5 mb-2">
        <p className="text-sm leading-tight text-foreground/90">
          <span className="font-bold text-foreground">{name}</span> {subtitle}
        </p>

        <span className="text-xs text-muted-foreground/60">{timestamp}</span>
      </div>

      {children}
    </div>
  </motion.div>
);

const MentionBox = ({ content }: { content: string }) => (
  <div className="flex flex-col gap-2">
    <div className="rounded-xl bg-muted/40 border border-border/40 p-3">
      <p className="text-xs leading-relaxed text-muted-foreground">{content}</p>
    </div>

    <div className="flex items-center gap-2 bg-muted/20 border border-border/30 rounded-lg px-3 py-2">
      <span className="text-[11px] text-muted-foreground flex-1">Reply</span>
      <div className="flex items-center gap-2 text-muted-foreground/40">
        <MessageSquareMore className="h-3.5 w-3.5" />
        <ImageIcon className="h-3.5 w-3.5" />
      </div>
    </div>
  </div>
);

const FileLink = ({ fileName }: { fileName: string }) => (
  <div className="flex items-center gap-2 bg-muted/40 border border-border/40 rounded-lg px-3 py-1.5 w-fit hover:bg-muted/60 transition-colors cursor-pointer group">
    <FileText className="h-3.5 w-3.5 text-red-500 fill-red-500/10" />
    <span className="text-xs font-bold text-foreground/80">{fileName}</span>
  </div>
);

const FigmaInvite = ({ projectName }: { projectName: string }) => (
  <div className="flex items-center gap-3 bg-muted/60 border border-border/50 rounded-lg p-3 w-full max-w-[280px]">
    <div className="h-9 w-9 rounded-lg bg-background border border-border/50 flex items-center justify-center shrink-0">
      <FigmaIcon />
    </div>

    <span className="text-xs font-bold text-foreground/90 truncate">
      {projectName}
    </span>
  </div>
);

const TagGroup = ({ tags }: { tags: { label: string; color: string }[] }) => (
  <div className="flex flex-wrap gap-1.5 mt-1">
    {tags.map((tag, i) => (
      <Badge
        key={i}
        variant="secondary"
        className={cn(
          "px-2 py-0 h-5 text-[10px] font-bold border-none transition-colors",
          tag.color,
        )}
      >
        {tag.label}
      </Badge>
    ))}
  </div>
);

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-[400px] p-8 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <History className="h-8 w-8 text-muted-foreground/50" />
      </div>

      <h3 className="text-sm font-semibold mb-1 text-foreground">
        No activities yet
      </h3>

      <p className="text-xs text-muted-foreground max-w-[200px]">
        When there are updates to your projects, they&apos;ll appear here.
      </p>
    </motion.div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-[400px] p-8 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h3 className="text-sm font-semibold mb-1 text-destructive">
        Failed to load
      </h3>

      <p className="text-xs text-muted-foreground mb-4">
        Something went wrong while fetching activities.
      </p>

      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCcw className="h-3 w-3" />
        Retry
      </Button>
    </motion.div>
  );
}

type ActivityStatus = "loading" | "error" | "empty" | "data";

function ActivityList() {
  const [status, setStatus] = useState<ActivityStatus>("loading");

  const startLoading = () => {
    setStatus("loading");
    setTimeout(() => {
      setStatus("data");
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("data");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 px-4 py-5 border-b border-border/40"
          >
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (status === "empty") {
    return <EmptyState />;
  }

  if (status === "error") {
    return <ErrorState onRetry={startLoading} />;
  }

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col w-full"
    >
      <ActivityItemWrapper
        index={0}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
        name="Joe Lincoln"
        subtitle="mentioned you in last trends topic"
        timestamp="18 mins ago"
      >
        <MentionBox content="@ShadcnStudio For an expert opinion, check out what Mike has to say on this topic!" />
      </ActivityItemWrapper>

      <ActivityItemWrapper
        index={1}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png"
        name="Jane Perez"
        subtitle="invites you to review a file"
        timestamp="39 mins ago"
      >
        <FileLink fileName="invoices.pdf" />
      </ActivityItemWrapper>

      <ActivityItemWrapper
        index={2}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png"
        name="Tyler Hero"
        subtitle="wants to view your design project"
        timestamp="1 hour ago"
      >
        <FigmaInvite projectName="Launcher-Uikit.fig" />
      </ActivityItemWrapper>

      <ActivityItemWrapper
        index={3}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
        name="Denial"
        subtitle="invites you to review the new design"
        timestamp="3 hours ago"
      />

      <ActivityItemWrapper
        index={4}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png"
        name="Leslie Alexander"
        subtitle="new tags to Web Redesign"
        timestamp="8 hours ago"
      >
        <TagGroup
          tags={[
            {
              label: "Client-Request",
              color: "bg-muted text-muted-foreground",
            },
            { label: "Figma", color: "bg-blue-500/10 text-blue-500" },
            {
              label: "Redesign",
              color: "bg-amber-500/10 text-amber-500",
            },
          ]}
        />
      </ActivityItemWrapper>

      <ActivityItemWrapper
        index={5}
        avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png"
        name="Miya"
        subtitle="invites you to review a file"
        timestamp="10 hours ago"
      />
    </motion.div>
  );
}

export function ActivitySheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 gap-0 border-l border-border bg-background/95 backdrop-blur-xl flex flex-col h-full"
      >
        <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="text-lg font-bold tracking-tight">
            Activity
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col w-full min-h-full">
              <AnimatePresence mode="wait">
                {open && <ActivityList />}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* <div className="p-4 border-t bg-muted/10">
          <Button
            variant="ghost"
            className="w-full justify-between group h-10 px-4"
            size="sm"
          >
            <span className="text-xs font-bold text-muted-foreground">
              View all history
            </span>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground/60" />
          </Button>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}
