import { createAuditLog } from "@/lib/db/repositories/audit-log.repo";
import type { NewAuditLog } from "@/lib/db/repositories/types";
import { logger } from "@/lib/logger";

export type AuditAction =
  | "login"
  | "logout"
  | "register"
  | "password_change"
  | "email_verified"
  | "invoice_created"
  | "invoice_updated"
  | "invoice_deleted"
  | "invoice_sent"
  | "invoice_marked_paid"
  | "invoice_duplicated"
  | "settings_updated"
  | "password_reset_requested"
  | "resend_verification"
  | "onboarding_completed"
  | "account_deleted";

export interface AuditOptions {
  userId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(
  action: AuditAction,
  options: AuditOptions = {},
) {
  try {
    const data: NewAuditLog = {
      action,
      userId: options.userId,
      entityType: options.entityType,
      entityId: options.entityId,
      metadata: options.metadata,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    };

    await createAuditLog(data);
  } catch (error) {
    logger.error("Failed to create audit log", { action, error, options });
  }
}
