"use client";

import {
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  FileLock2,
  FileText,
  FolderKanban,
  Home,
  LogOut,
  PenLine,
  Receipt,
  Settings2,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Badal",
    email: "badal@softwarecrafting.in",
    avatar: "https://github.com/bad-al-code.png",
    role: "Admin",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Invoices",
      url: "#",
      icon: FileText,
      items: [
        { title: "All Invoices", url: "/invoices" },
        { title: "Create Invoice", url: "/invoices/new" },
        { title: "Recurring", url: "/invoices/recurring" },
        { title: "Payments Received", url: "/invoices/payments" },
      ],
    },
    {
      title: "Contracts & NDA",
      url: "#",
      icon: FileLock2,
      items: [
        { title: "All Contracts", url: "/contracts" },
        { title: "New Contract", url: "/contracts/new" },
        { title: "NDA Templates", url: "/contracts/nda" },
        { title: "Drafts", url: "/contracts/drafts" },
      ],
    },
    {
      title: "E-Signature",
      url: "#",
      icon: PenLine,
      items: [
        { title: "Pending Signature", url: "/esign/pending" },
        { title: "Completed", url: "/esign/completed" },
        { title: "Send for Signing", url: "/esign/send" },
      ],
    },
    {
      title: "Proposals",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "All Proposals", url: "/proposals" },
        { title: "Create Proposal", url: "/proposals/new" },
        { title: "Templates", url: "/proposals/templates" },
        { title: "Sent & Accepted", url: "/proposals/accepted" },
      ],
    },
    {
      title: "Clients",
      url: "#",
      icon: Users,
      items: [
        { title: "All Clients", url: "/clients" },
        { title: "Add Client", url: "/clients/new" },
        { title: "Client Portal", url: "/clients/portal" },
        { title: "Contacts", url: "/clients/contacts" },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderKanban,
      items: [
        { title: "All Projects", url: "/projects" },
        { title: "Kanban Board", url: "/projects/board" },
        { title: "Tasks", url: "/projects/tasks" },
        { title: "Milestones", url: "/projects/milestones" },
      ],
    },
    {
      title: "Time Tracking",
      url: "#",
      icon: Timer,
      items: [
        { title: "Log Time", url: "/time/log" },
        { title: "Timesheets", url: "/time/sheets" },
        { title: "Reports", url: "/time/reports" },
      ],
    },
    {
      title: "Expenses",
      url: "#",
      icon: Receipt,
      items: [
        { title: "All Expenses", url: "/expenses" },
        { title: "Add Expense", url: "/expenses/new" },
        { title: "Categories", url: "/expenses/categories" },
        { title: "Reports", url: "/expenses/reports" },
      ],
    },
    {
      title: "AI Tools",
      url: "#",
      icon: Sparkles,
      items: [
        { title: "Content Generator", url: "/ai/content" },
        { title: "Proposal Writer", url: "/ai/proposal" },
        { title: "Email Drafts", url: "/ai/email" },
        { title: "NDA Generator", url: "/ai/nda" },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Profile", url: "/settings/profile" },
        { title: "Billing", url: "/settings/billing" },
        { title: "Team", url: "/settings/team" },
        { title: "Integrations", url: "/settings/integrations" },
        { title: "API Keys", url: "/settings/api-keys" },
      ],
    },
  ],
  recentClients: [
    {
      name: "Acme Corp",
      avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png",
    },
    {
      name: "Deepak Rajput",
      avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png",
    },
    {
      name: "TechStart Inc",
      avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png",
    },
  ],
};

function NavMain({ items }: { items: typeof data.navMain }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pages</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isParentActive = item.items?.some(
            (subItem) => subItem.url === pathname,
          );
          const isActive = item.url === pathname || isParentActive;

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={isActive} asChild>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavRecipients({
  recipients,
}: {
  recipients: typeof data.recentClients;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recipients</SidebarGroupLabel>
      <SidebarMenu>
        {recipients.map((recipient) => (
          <SidebarMenuItem key={recipient.name}>
            <SidebarMenuButton asChild>
              <a href="#">
                <Avatar className="size-4 shrink-0">
                  <AvatarImage src={recipient.avatar} />
                  <AvatarFallback className="text-[9px]">
                    {recipient.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{recipient.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function NavUser({ user }: { user: typeof data.user }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">JD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.role}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className=" size-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className=" size-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className=" size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOut className=" size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-foreground text-sidebar">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                  >
                    <path d="M12 2v20M2 12h20" />
                    <path d="m4.93 4.93 14.14 14.14" />
                    <path d="m4.93 19.07 14.14-14.14" />
                  </svg>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tools</span>
                  <span className="truncate text-xs">softwarecrafting.in</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain items={data.navMain} />
          <NavRecipients recipients={data.recentClients} />
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
