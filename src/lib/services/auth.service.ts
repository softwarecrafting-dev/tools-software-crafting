import { VerificationEmail } from "@/emails/verification-email";
import type { SafeUser } from "@/lib/db/repositories/types";
import {
  createUser,
  createVerificationToken,
  findUserByEmail,
} from "@/lib/db/repositories/user.repo";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { resend } from "@/lib/resend";
import type { RegisterInput } from "@/lib/validators/user";
import { render } from "@react-email/components";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailAlreadyExistsError";
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
