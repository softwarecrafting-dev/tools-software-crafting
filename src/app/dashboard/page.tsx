import { Metadata } from "next";
import { DashboardOverview } from "./components/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard | SoftwareCrafting Tools",
  description: "Overview of your business performance and tools.",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
