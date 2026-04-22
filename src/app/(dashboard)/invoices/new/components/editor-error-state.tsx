"use client";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import {
  AlertCircle,
  Clock,
  Lock,
  RefreshCw,
  RotateCw,
  ServerCrash,
  WifiOff,
} from "lucide-react";
import type { ReactNode } from "react";

interface EditorErrorStateProps {
  error: unknown;
  onRetry: () => void;
  isRetrying: boolean;
}

const ERROR_CONFIG: Record<
  string,
  { icon: ReactNode; title: string; hint: string }
> = {
  RATE_LIMITED: {
    icon: <Clock className="h-8 w-8 text-amber-500" />,
    title: "Slow down a little",
    hint: "You've made too many requests. Wait a moment and try again.",
  },
  UNAUTHORIZED: {
    icon: <Lock className="h-8 w-8 text-destructive" />,
    title: "Session expired",
    hint: "Your session may have expired. Please refresh the page or sign in again.",
  },
  NETWORK_ERROR: {
    icon: <WifiOff className="h-8 w-8 text-muted-foreground" />,
    title: "No connection",
    hint: "Check your internet connection and try again.",
  },
  INTERNAL_ERROR: {
    icon: <ServerCrash className="h-8 w-8 text-destructive" />,
    title: "Server error",
    hint: "Something went wrong on our end. We're on it — try again in a moment.",
  },
};

function resolveErrorCode(status: number): string {
  if (status === 429) return "RATE_LIMITED";
  if (status === 401) return "UNAUTHORIZED";
  if (status === 0) return "NETWORK_ERROR";
  return "INTERNAL_ERROR";
}

export function EditorErrorState({
  error,
  onRetry,
  isRetrying,
}: EditorErrorStateProps) {
  const apiErr = error instanceof ApiError ? error : null;
  const status = apiErr?.status ?? 0;
  const resolvedCode = resolveErrorCode(status);

  const { icon, title, hint } = ERROR_CONFIG[resolvedCode] ?? {
    icon: <AlertCircle className="h-8 w-8 text-destructive" />,
    title: "Failed to load editor",
    hint: "An unexpected error occurred. Please try again.",
  };

  return (
    <div className="flex h-[450px] flex-col items-center justify-center rounded-xl border border-dashed bg-card/30 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center gap-3 p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
          {icon}
        </div>

        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

        {apiErr?.message && apiErr.message !== hint && (
          <p className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-md border">
            {apiErr.message}
          </p>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed">{hint}</p>

        <Button
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-2 gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          {isRetrying ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCw className="h-4 w-4" />
          )}
          {isRetrying ? "Retrying..." : "Try again"}
        </Button>
      </div>
    </div>
  );
}
