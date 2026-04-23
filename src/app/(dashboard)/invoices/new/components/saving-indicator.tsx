"use client";

import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface SavingIndicatorProps {
  isSaving: boolean;
  lastSavedAt: Date | null;
}

export function SavingIndicator({ isSaving, lastSavedAt }: SavingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground tabular-nums min-h-6">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span>Saving...</span>
          </motion.div>
        ) : lastSavedAt ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-1.5"
          >
            <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>Last saved at {format(lastSavedAt, "HH:mm:ss")}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
