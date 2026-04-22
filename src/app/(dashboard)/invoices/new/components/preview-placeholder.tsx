"use client";

import { FileText } from "lucide-react";
import { motion } from "motion/react";

export function PreviewPlaceholder() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex gap-1 p-3 border-b bg-muted/30">
        {["Minimal", "Classic", "Modern"].map((t, i) => (
          <button
            key={t}
            className={`flex-1 text-xs font-medium py-1.5 px-3 rounded-md transition-colors ${
              i === 0
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl border bg-card shadow-sm min-h-[500px] flex flex-col items-center justify-center gap-3 text-center p-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>

          <p className="text-sm font-medium text-foreground">Live Preview</p>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            Fill in the form to see your invoice preview here in real time.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
