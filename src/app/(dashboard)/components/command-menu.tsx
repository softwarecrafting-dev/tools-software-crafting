"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Flame,
  LayoutDashboard,
  Monitor,
  MoreVertical,
  ShoppingCart,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SuggestionItem = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <CommandItem className="rounded-lg  group flex items-center w-full">
    <Icon className=" h-5 w-5 text-muted-foreground transition-colors group-data-[selected=true]:text-primary" />
    <span className="text-sm font-medium">{label}</span>
  </CommandItem>
);

const InteractionItem = ({
  icon: Icon,
  title,
  subtitle,
  iconColorClass,
  avatars,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconColorClass: string;
  avatars: string[];
}) => (
  <CommandItem className="rounded-lg flex items-center justify-between w-full cursor-pointer group px-4">
    <div className="flex items-center flex-1">
      <div
        className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3 border shrink-0 ${iconColorClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold">{title}</span>
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      </div>
    </div>
    <div className="flex -space-x-2 shrink-0 ml-4">
      {avatars.slice(0, 3).map((src, i) => (
        <Avatar key={i} className="h-6 w-6 border-2 border-popover shadow-sm">
          <AvatarImage src={src} />
        </Avatar>
      ))}
      {avatars.length > 3 && (
        <Avatar className="h-6 w-6 rounded-full bg-muted border-2 border-popover flex items-center justify-center text-[8px] font-bold">
          +{avatars.length - 3}
        </Avatar>
      )}
    </div>
  </CommandItem>
);

const UserItem = ({
  name,
  email,
  avatar,
  status,
  statusColor,
}: {
  name: string;
  email: string;
  avatar: string;
  status: string;
  statusColor: string;
}) => (
  <CommandItem className="rounded-lg py-3 flex items-center justify-between w-full cursor-pointer group space-y-0 px-4">
    <div className="flex items-center flex-1">
      <Avatar className="h-9 w-9 rounded-full mr-3 border border-border shrink-0">
        <AvatarImage src={avatar} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-bold leading-none">{name}</span>
        <span className="text-xs text-muted-foreground mt-0.5">{email}</span>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0 ml-4">
      <Badge
        variant="secondary"
        className={`${statusColor} border-none font-medium text-[10px] h-5`}
      >
        {status}
      </Badge>

      <MoreVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
    </div>
  </CommandItem>
);

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="max-w-[550px]"
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex flex-col h-full bg-popover text-popover-foreground outline-none"
          >
            <CommandInput
              placeholder="Search components or actions..."
              className="border-none focus:ring-0 bg-transparent py-6"
            />

            <ScrollArea className="max-h-[min(500px,70vh)]">
              <CommandList className="max-h-none border-none">
                <CommandEmpty>No results found.</CommandEmpty>

                <div className="px-2">
                  <CommandGroup
                    heading="SUGGESTIONS"
                    className="text-[10px] font-bold text-muted-foreground tracking-wider"
                  >
                    <SuggestionItem icon={Users} label="Marketing UI Page" />
                    <SuggestionItem
                      icon={ShoppingCart}
                      label="e-commerce UI Page"
                    />
                    <SuggestionItem
                      icon={LayoutDashboard}
                      label="Dashboard UI Page"
                    />
                  </CommandGroup>
                </div>

                <CommandSeparator className="bg-border mx-2" />

                <div className="px-2">
                  <CommandGroup
                    heading="INTERACTIONS"
                    className="text-[10px] font-bold text-muted-foreground tracking-wider"
                  >
                    <InteractionItem
                      icon={Monitor}
                      title="Jira"
                      subtitle="Project management"
                      iconColorClass="bg-blue-500/10 border-blue-500/20 text-blue-500"
                      avatars={[
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
                      ]}
                    />

                    <InteractionItem
                      icon={Flame}
                      title="Inferno"
                      subtitle="Real-time photo sharing app"
                      iconColorClass="bg-red-500/10 border-red-500/20 text-red-500"
                      avatars={[
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png",
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-6.png",
                        "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-7.png",
                      ]}
                    />
                  </CommandGroup>
                </div>

                <CommandSeparator className="bg-border mx-2" />

                <div className="px-2">
                  <CommandGroup
                    heading="USERS"
                    className="text-[10px] font-bold text-muted-foreground tracking-wider"
                  >
                    <UserItem
                      name="Barry Barnett"
                      email="barry@hotmail.com"
                      avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                      status="In office"
                      statusColor="bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                    />
                    <UserItem
                      name="Maria Donin"
                      email="maria@hotmail.com"
                      avatar="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png"
                      status="On leave"
                      statusColor="bg-amber-500/10 text-amber-500 dark:text-amber-400"
                    />
                  </CommandGroup>
                </div>
              </CommandList>
            </ScrollArea>

            <div className="mt-auto border-t border-border p-3 flex items-center gap-4 text-muted-foreground/70 text-[11px] font-medium">
              <div className="flex items-center gap-1.5">
                <Kbd>esc</Kbd>
                <span>To close</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Kbd>
                  <CornerDownLeft />
                </Kbd>
                <span>To Select</span>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <KbdGroup>
                  <Kbd>
                    <ArrowUp />
                  </Kbd>
                  <Kbd>
                    <ArrowDown />
                  </Kbd>
                </KbdGroup>
                <span>To Navigate</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CommandDialog>
  );
}
