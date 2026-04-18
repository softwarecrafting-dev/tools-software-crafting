import { getSession, type SessionData } from "@/lib/auth";

export class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireAuth(
  role?: "admin" | "member",
): Promise<SessionData> {
  const session = await getSession();

  if (!session.userId) {
    throw new AuthError();
  }

  if (role && session.role !== role) {
    throw new ForbiddenError();
  }

  return {
    userId: session.userId,
    role: session.role,
    sessionId: session.sessionId,
    expiresAt: session.expiresAt!,
  };
}
