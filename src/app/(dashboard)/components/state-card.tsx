"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";

interface StateCardProps {
  title: string;
  value: string | number;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

export function StateCard({
  title,
  value,
  description,
  isLoading,
  className,
}: StateCardProps) {
  if (isLoading) {
    return (
      <Card className={cn("bg-background/10 backdrop-blur-md border-white/5 shadow-2xl", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24 bg-white/10" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 bg-white/10" />
          <Skeleton className="mt-2 h-4 w-20 bg-white/10" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className={cn(
          "bg-background/10 backdrop-blur-md border-white/5 shadow-2xl transition-all hover:bg-background/15 hover:border-white/10 group", 
          className
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-bold text-background/60 group-hover:text-background transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight text-background">
            {value}
          </div>
          {description && (
            <p className="text-xs text-background/50 mt-1 font-medium italic">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
