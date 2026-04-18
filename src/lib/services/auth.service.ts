import {
  createPasswordResetToken,
  deletePasswordResetToken,
  deleteUserPasswordResetTokens,
  findPasswordResetToken,
} from "@/lib/db/repositories/password-reset.repo";
import {
  createSession,
  deleteSession,
  revokeAllUserSessions,
} from "@/lib/db/repositories/session.repo";
import type { SafeUser } from "@/lib/db/repositories/types";
import {
  createUser,
  createVerificationToken,
  deleteVerificationTokensByIdentifier,
  findUserByEmail,
  mapToSafeUser,
  updateUserPassword,
} from "@/lib/db/repositories/user.repo";
import { logger } from "@/lib/logger";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { logAudit } from "./audit.service";
import {
  HASH_SALT_ROUNDS,
  PASSWORD_RESET_TOKEN_EXPIRES_IN,
  SESSION_EXPIRES_IN,
  VERIFICATION_TOKEN_EXPIRES_IN,
} from "@/lib/constants";
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidTokenError,
  TokenExpiredError,
} from "@/lib/errors";

export {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidTokenError,
  TokenExpiredError,
};
import { generateToken } from "@/lib/utils/auth";
import { routes } from "@/lib/routes";
import type { LoginInput, RegisterInput } from "@/lib/validators/user";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

/**
 * Creates a verification token and sends the verification email.
 */
async function initiateEmailVerification(
  email: string,
  name: string | null,
  userId: string,
) {
  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_IN);

  await createVerificationToken({
    identifier: email,
    token: rawToken,
    expiresAt,
  });

  const verificationUrl = routes.auth.verifyEmail(rawToken);

  try {
    await sendVerificationEmail(email, name ?? "there", verificationUrl, userId);
    logger.info("Verification email sent", { userId });
  } catch (emailError) {
    logger.warn("Failed to send verification email", {
      userId,
      error: emailError,
    });
  }
}

export async function register(
  data: RegisterInput & { ipAddress?: string; userAgent?: string },
): Promise<{ user: SafeUser }> {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await bcrypt.hash(data.password, HASH_SALT_ROUNDS);

  const newUser = await createUser({
    email: data.email,
    name: data.name,
    passwordHash,
  });

  await initiateEmailVerification(data.email, data.name, newUser.id);

  await logAudit("register", {
    userId: newUser.id,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    metadata: { email: data.email },
  });

  return { user: mapToSafeUser(newUser) };
}

export async function login(
  data: LoginInput & { ipAddress?: string; userAgent?: string },
): Promise<{ user: SafeUser; sessionToken: string }> {
  const user = await findUserByEmail(data.email);

  if (!user || !user.isActive || !user.passwordHash) {
    throw new InvalidCredentialsError();
  }

  const isValidPassword = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );
  if (!isValidPassword) {
    throw new InvalidCredentialsError();
  }

  const sessionToken = nanoid(32);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRES_IN);

  await createSession({
    userId: user.id,
    token: sessionToken,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    expiresAt,
  });

  await logAudit("login", {
    userId: user.id,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  });

  logger.info("User logged in", { userId: user.id });

  return { user: mapToSafeUser(user), sessionToken };
}

export async function forgotPassword(
  email: string,
  options?: { ipAddress?: string; userAgent?: string },
): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    logger.info("Forgot password requested for non-existent user", { email });
    return;
  }

  await deleteUserPasswordResetTokens(user.id);

  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRES_IN);

  await createPasswordResetToken({
    userId: user.id,
    token: rawToken,
    expiresAt,
  });

  const resetUrl = routes.auth.resetPassword(rawToken);

  try {
    await sendPasswordResetEmail(email, user.name ?? "there", resetUrl, user.id);
    logger.info("Password reset email sent", { userId: user.id });

    await logAudit("password_reset_requested", {
      userId: user.id,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: { email },
    });
  } catch (emailError) {
    logger.error("Failed to send password reset email", {
      userId: user.id,
      error: emailError,
    });
  }
}

export async function resetPassword(
  token: string,
  passwordHash: string,
  options?: { ipAddress?: string; userAgent?: string },
): Promise<void> {
  const record = await findPasswordResetToken(token);

  if (!record) {
    throw new InvalidTokenError();
  }

  const isExpired = new Date() > record.expiresAt;

  if (isExpired) {
    await deletePasswordResetToken(record.id);
    throw new TokenExpiredError();
  }

  try {
    const newHash = await bcrypt.hash(passwordHash, HASH_SALT_ROUNDS);

    await updateUserPassword(record.userId, newHash);
    await revokeAllUserSessions(record.userId);

    await logAudit("password_change", {
      userId: record.userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    });

    logger.info("Password reset successfully", { userId: record.userId });
  } finally {
    await deletePasswordResetToken(record.id);
  }
}

export async function resendVerification(
  email: string,
  options?: { ipAddress?: string; userAgent?: string },
): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    logger.info("Resend verification requested for non-existent user", {
      email,
    });
    return;
  }

  if (user.emailVerified) {
    logger.info("Resend verification requested for already verified user", {
      userId: user.id,
    });
    return;
  }

  await deleteVerificationTokensByIdentifier(email);
  await initiateEmailVerification(email, user.name, user.id);

  await logAudit("resend_verification", {
    userId: user.id,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    metadata: { email },
  });
}

export async function logout(
  sessionId: string,
  options?: { userId?: string; ipAddress?: string; userAgent?: string },
): Promise<void> {
  await deleteSession(sessionId);

  await logAudit("logout", {
    userId: options?.userId,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
  });

  logger.info("User logged out", { userId: options?.userId });
}
