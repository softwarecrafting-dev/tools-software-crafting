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
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        user={{
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        }}
        className="hidden md:flex"
      />

      <div className="flex flex0 flex-col overflow-hidden">
        <Header />

        <main className="flex0 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          <div className="mx-auto max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
