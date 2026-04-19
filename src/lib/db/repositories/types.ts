import {
  users,
  verificationTokens,
  sessions,
  passwordResetTokens,
  emailLogs,
  auditLogs,
  userSettings,
  invoices,
} from "@/lib/db/schema";

export type CreateUserInput = typeof users.$inferInsert;
export type UserRecord = typeof users.$inferSelect;
export type SafeUser = Omit<UserRecord, "passwordHash" | "deletedAt">;

export type CreateVerificationTokenInput =
  typeof verificationTokens.$inferInsert;
export type VerificationTokenRecord = typeof verificationTokens.$inferSelect;

export type NewSession = typeof sessions.$inferInsert;
export type Session = typeof sessions.$inferSelect;

export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type PasswordResetTokenRecord = typeof passwordResetTokens.$inferSelect;

export type NewEmailLog = typeof emailLogs.$inferInsert;
export type EmailLogRecord = typeof emailLogs.$inferSelect;

export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AuditLogRecord = typeof auditLogs.$inferSelect;

export type NewUserSettings = typeof userSettings.$inferInsert;
export type UserSettingsRecord = typeof userSettings.$inferSelect;

export type NewInvoice = typeof invoices.$inferInsert;
export type InvoiceRecord = typeof invoices.$inferSelect;
