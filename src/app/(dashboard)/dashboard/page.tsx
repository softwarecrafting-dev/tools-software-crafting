import DashboardClient from "./dashboard-client";

export const metadata = {
  title: "Dashboard",
  description: "Overview of your business performance and recent invoices.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
