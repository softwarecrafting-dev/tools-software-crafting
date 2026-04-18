import {
  deleteVerificationToken,
  findUserByEmail,
  findVerificationToken,
  markUserEmailVerified,
} from "@/lib/db/repositories/user.repo";
import { logger } from "@/lib/logger";

export class InvalidTokenError extends Error {
  constructor() {
    super("Invalid verification token");
    this.name = "InvalidTokenError";
  }
}

export class TokenExpiredError extends Error {
  constructor() {
    super("Verification token expired");
    this.name = "TokenExpiredError";
  }
}

export class UserAlreadyVerifiedError extends Error {
  constructor() {
    super("User is already verified");
    this.name = "UserAlreadyVerifiedError";
  }
}

export async function verifyEmail(tokenString: string) {
  const token = await findVerificationToken(tokenString);

  if (!token) {
    throw new InvalidTokenError();
  }

  const user = await findUserByEmail(token.identifier);
  if (!user) {
    throw new InvalidTokenError();
  }

  if (user.emailVerified) {
    await deleteVerificationToken(token.id);
    throw new UserAlreadyVerifiedError();
  }

  if (token.expiresAt < new Date()) {
    throw new TokenExpiredError();
  }

  await markUserEmailVerified(user.id);
  await deleteVerificationToken(token.id);

  logger.info("User email verified", { userId: user.id });

  return { user };
}
