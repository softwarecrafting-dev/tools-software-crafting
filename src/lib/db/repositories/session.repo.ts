import { db } from "@/lib/db/client";
import { sessions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NewSession, Session } from "./types";

export async function createSession(data: NewSession): Promise<Session> {
  const [session] = await db.insert(sessions).values(data).returning();

  return session;
}

export async function findSessionByToken(
  token: string,
): Promise<Session | undefined> {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token));

  return session;
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteUserSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export const revokeAllUserSessions = deleteUserSessions;
