import { db } from "@/lib/db/client";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type {
  CreateUserInput,
  CreateVerificationTokenInput,
  SafeUser,
  UserRecord,
  VerificationTokenRecord,
} from "./types";

export function mapToSafeUser(user: UserRecord): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    onboardingDone: user.onboardingDone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
  };
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | undefined> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
}

export async function findUserById(
  id: string,
): Promise<UserRecord | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return user;
}

export async function createUser(data: CreateUserInput): Promise<UserRecord> {
  const [user] = await db.insert(users).values(data).returning();

  return user;
}

export async function createVerificationToken(
  data: CreateVerificationTokenInput,
): Promise<VerificationTokenRecord> {
  const [token] = await db.insert(verificationTokens).values(data).returning();

  return token;
}

export async function findVerificationToken(
  rawToken: string,
): Promise<VerificationTokenRecord | undefined> {
  const [token] = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, rawToken))
    .limit(1);

  return token;
}

export async function deleteVerificationToken(id: string): Promise<void> {
  await db.delete(verificationTokens).where(eq(verificationTokens.id, id));
}

export async function deleteVerificationTokensByIdentifier(
  identifier: string,
): Promise<void> {
  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, identifier));
}

export async function markUserEmailVerified(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function updateUserPassword(
  userId: string,
  passwordHash: string,
): Promise<void> {
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));
}
