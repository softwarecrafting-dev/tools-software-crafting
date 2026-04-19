import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardHeader } from "./components/dashboard-header";
import { DashboardSidebar } from "./components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.userId) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden">
        <DashboardSidebar />

        <SidebarInset className="relative flex-1 flex-col overflow-hidden">
          <div className="container mx-auto px-4">
            <DashboardHeader />
            <main className="relative flex-1 pt-2 overflow-y-auto">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
