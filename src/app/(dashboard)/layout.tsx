import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { findUserById } from "@/lib/db/repositories/user.repo";
import { requireAuth } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const user = await findUserById(session.userId);

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingDone) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden ">
        <Sidebar
          user={{
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          }}
          className="hidden md:flex"
        />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-none">
          <div className="absolute inset-0 -z-10 h-[45%] w-full bg-primary" />

          <Header />

          <main className="flex-1 p-6 md:p-8 ">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
