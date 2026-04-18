import { VerificationEmail } from "@/emails/verification-email";
import type { SafeUser } from "@/lib/db/repositories/types";
import {
  createUser,
  createVerificationToken,
  findUserByEmail,
} from "@/lib/db/repositories/user.repo";
import { createSession } from "@/lib/db/repositories/session.repo";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { resend } from "@/lib/resend";
import type { RegisterInput, LoginInput } from "@/lib/validators/user";
import { render } from "@react-email/components";
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
    const html = await render(
      VerificationEmail({ name: data.name, verificationUrl }),
    );
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: data.email,
      subject: "Verify your email - SoftwareCrafting Tools",
      html,
    });
    logger.info("Verification email sent", { userId: newUser.id });
  } catch (emailError) {
    logger.warn("Failed to send verification email", {
      userId: newUser.id,
      error: emailError,
    });
  }

  return { user: buildSafeUser(newUser) };
}

export async function login(data: LoginInput & { ipAddress?: string; userAgent?: string }): Promise<{ user: SafeUser; sessionToken: string }> {
  const user = await findUserByEmail(data.email);
  
  if (!user || !user.isActive || !user.passwordHash) {
    throw new InvalidCredentialsError();
  }

  const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
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
