import { db } from "@/lib/db/client";
import { passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NewPasswordResetToken, PasswordResetTokenRecord } from "./types";

export async function createPasswordResetToken(
  data: NewPasswordResetToken,
): Promise<PasswordResetTokenRecord> {
  const [token] = await db.insert(passwordResetTokens).values(data).returning();

  return token;
}

export async function findPasswordResetToken(
  token: string,
): Promise<PasswordResetTokenRecord | undefined> {
  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);

  return record;
}

export async function deletePasswordResetToken(id: string): Promise<void> {
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, id));
}

export async function deleteUserPasswordResetTokens(
  userId: string,
): Promise<void> {
  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.userId, userId));
}
