import {
  createPasswordResetToken,
  deletePasswordResetToken,
  deleteUserPasswordResetTokens,
  findPasswordResetToken,
} from "@/lib/db/repositories/password-reset.repo";
import {
  createSession,
  revokeAllUserSessions,
} from "@/lib/db/repositories/session.repo";
import type { SafeUser } from "@/lib/db/repositories/types";
import {
  createUser,
  createVerificationToken,
  findUserByEmail,
  mapToSafeUser,
  updateUserPassword,
} from "@/lib/db/repositories/user.repo";
import { logger } from "@/lib/logger";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
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
    await sendVerificationEmail(email, name ?? "there", verificationUrl);
    logger.info("Verification email sent", { userId });
  } catch (emailError) {
    logger.warn("Failed to send verification email", {
      userId,
      error: emailError,
    });
  }
}

export async function register(
  data: RegisterInput,
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

  logger.info("User logged in", { userId: user.id });

  return { user: mapToSafeUser(user), sessionToken };
}

export async function forgotPassword(email: string): Promise<void> {
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
    await sendPasswordResetEmail(email, user.name ?? "there", resetUrl);
    logger.info("Password reset email sent", { userId: user.id });
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
    logger.info("Password reset successfully", { userId: record.userId });
  } finally {
    await deletePasswordResetToken(record.id);
  }
}
