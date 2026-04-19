import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a1a] p-3 text-white transition-transform active:scale-95",
      )}
    >
      <PanelLeft className="h-6 w-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

export function HeaderGreeting() {
  return (
    <div className="flex flex-col">
      <h1 className="text-base font-bold leading-tight  md:text-lg">
        Hey, John
      </h1>
      <p className="text-sm font-medium text-muted-foreground/80">
        Welcome back to dashboard
      </p>
    </div>
  );
}
