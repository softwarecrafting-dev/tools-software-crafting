import { PasswordResetEmail } from "@/emails/password-reset-email";
import { VerificationEmail } from "@/emails/verification-email";
import { resend } from "@/lib/resend";
import { render } from "@react-email/components";

const EMAIL_FROM = "Acme <onboarding@resend.dev>";
const APP_NAME = "SoftwareCrafting Tools";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions) {
  return resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: `${subject} - ${APP_NAME}`,
    html,
  });
}

export async function sendVerificationEmail(email: string, name: string, verificationUrl: string) {
  const html = await render(
    VerificationEmail({ name: name || "there", verificationUrl }),
  );

  return sendEmail({
    to: email,
    subject: "Verify your email",
    html,
  });
}

export async function sendPasswordResetEmail(email: string, name: string, resetUrl: string) {
  const html = await render(
    PasswordResetEmail({ name: name || "there", resetUrl }),
  );

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html,
  });
}
