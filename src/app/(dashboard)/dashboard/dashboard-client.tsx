"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { ArrowUpRight, Clock, DollarSign, FileText, Users } from "lucide-react";
import Link from "next/link";
import { StatCard } from "./components/stat-cards";

/**
 * We use a separate interior component if we wanted to pre-fetch on the server,
 * but for now we'll handle it all in one client component for simplicity.
 */
export default function DashboardClient() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
        <h3 className="text-lg font-semibold">Failed to fetch stats</h3>
        <p className="text-sm text-muted-foreground">
          There was an error loading your dashboard. Please try again.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/invoices/new">
              <FileText className=" h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue}`}
          icon={DollarSign}
          trend={{
            value: stats?.revenueChange || "0%",
            direction: stats?.revenueStatus || "stable",
          }}
          description="from last month"
        />
        <StatCard
          title="Outstanding"
          value={`₹${stats?.outstandingAmount}`}
          icon={Clock}
          description="Unpaid invoices"
        />
        <StatCard
          title="Active Clients"
          value={stats?.activeClients || 0}
          icon={Users}
          description="Total clients billed"
        />
        <StatCard
          title="Total Invoices"
          value={stats?.totalInvoices || 0}
          icon={FileText}
          description="Generated this year"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full md:col-span-4 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Performance</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              View Analytics <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              Revenue chart will appear here once you have invoice data.
            </p>
          </div>
        </div>

        <div className="col-span-full md:col-span-3 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Invoices</h3>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/invoices">View all</Link>
            </Button>
          </div>
          <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center px-4">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium">No invoices yet</p>
            <p className="text-xs text-muted-foreground">
              Start by creating your first invoice to see it here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-xl border bg-card"
          />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4 h-[400px] animate-pulse rounded-xl border bg-card" />
        <div className="col-span-3 h-[400px] animate-pulse rounded-xl border bg-card" />
      </div>
    </div>
  );
}
