import { users, verificationTokens } from "@/lib/db/schema";

export type CreateUserInput = typeof users.$inferInsert;
export type UserRecord = typeof users.$inferSelect;
export type SafeUser = Omit<UserRecord, "passwordHash" | "deletedAt">;

export type CreateVerificationTokenInput =
  typeof verificationTokens.$inferInsert;
export type VerificationTokenRecord = typeof verificationTokens.$inferSelect;
