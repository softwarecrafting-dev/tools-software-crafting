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
  updateUserPassword,
} from "@/lib/db/repositories/user.repo";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import type { LoginInput, RegisterInput } from "@/lib/validators/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { nanoid } from "nanoid";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}

export class TokenExpiredError extends Error {
  constructor() {
    super("The token has expired.");
    this.name = "TokenExpiredError";
  }
}

export class InvalidTokenError extends Error {
  constructor() {
    super("The token is invalid.");
    this.name = "InvalidTokenError";
  }
}

function buildSafeUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean;
  onboardingDone: boolean;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
  isActive: boolean;
}): SafeUser {
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

export async function register(
  data: RegisterInput,
): Promise<{ user: SafeUser }> {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new EmailAlreadyExistsError();
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const newUser = await createUser({
    email: data.email,
    name: data.name,
    passwordHash,
  });

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await createVerificationToken({
    identifier: data.email,
    token: rawToken,
    expiresAt,
  });

  const verificationUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email/${rawToken}`;

  try {
    await sendVerificationEmail(
      data.email,
      data.name ?? "there",
      verificationUrl,
    );

    logger.info("Verification email sent", { userId: newUser.id });
  } catch (emailError) {
    logger.warn("Failed to send verification email", {
      userId: newUser.id,
      error: emailError,
    });
  }

  return { user: buildSafeUser(newUser) };
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
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await createSession({
    userId: user.id,
    token: sessionToken,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    expiresAt,
  });

  logger.info("User logged in", { userId: user.id });

  return { user: buildSafeUser(user), sessionToken };
}

export async function forgotPassword(email: string): Promise<void> {
  const user = await findUserByEmail(email);

  if (!user) {
    logger.info("Forgot password requested for non-existent user", { email });
    return;
  }

  await deleteUserPasswordResetTokens(user.id);

  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await createPasswordResetToken({
    userId: user.id,
    token: rawToken,
    expiresAt,
  });

  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password/${rawToken}`;

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

  if (new Date() > record.expiresAt) {
    await deletePasswordResetToken(record.id);
    throw new TokenExpiredError();
  }

  const newHash = await bcrypt.hash(passwordHash, 12);

  await updateUserPassword(record.userId, newHash);
  await revokeAllUserSessions(record.userId);
  await deletePasswordResetToken(record.id);

  logger.info("Password reset successfully", { userId: record.userId });
}
