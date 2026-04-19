"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { motion } from "motion/react";
import { StateCard } from "./state-card";

export function DashboardOverview() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StateCard
          title="Total Revenue"
          value={isLoading ? "..." : `$${stats?.totalRevenue || "0.00"}`}
          description={`${stats?.revenueChange || "+0%"} from last month`}
          isLoading={isLoading}
        />
        <StateCard
          title="Outstanding"
          value={isLoading ? "..." : `$${stats?.outstandingAmount || "0.00"}`}
          description="Awaiting payment"
          isLoading={isLoading}
        />
        <StateCard
          title="Total Invoices"
          value={isLoading ? "..." : stats?.totalInvoices || 0}
          description="Invoiced to date"
          isLoading={isLoading}
        />
        <StateCard
          title="Active Clients"
          value={isLoading ? "..." : stats?.activeClients || 0}
          description="Managed relationships"
          isLoading={isLoading}
        />
      </div>

      {/* Charts & Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="col-span-full lg:col-span-4 bg-card/60 backdrop-blur-md border-border/40 shadow-xl overflow-hidden group">
          <CardHeader className="border-b border-border/10 bg-muted/20">
            <CardTitle className="text-lg font-bold">
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center text-muted-foreground italic relative">
            <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
            <span className="relative z-10 font-medium opa-70">
              Chart component visual placeholder
            </span>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3 bg-card/60 backdrop-blur-md border-border/40 shadow-xl group">
          <CardHeader className="border-b border-border/10 bg-muted/20">
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div className="p-8 rounded-2xl bg-muted/30 border-2 border-dashed border-border/40 text-sm text-center text-muted-foreground transition-all group-hover:bg-muted/40 group-hover:border-primary/20">
                <p className="font-semibold text-foreground/60 mb-1">
                  Getting Started?
                </p>
                <p className="text-xs">
                  Shortcuts & recommended actions will appear here as you build
                  your business profile.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
