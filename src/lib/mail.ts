import { InvoiceEmail } from "@/emails/invoice-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";
import { VerificationEmail } from "@/emails/verification-email";
import {
  createEmailLog,
  updateEmailLogStatus,
} from "@/lib/db/repositories/email-log.repo";
import { logger } from "@/lib/logger";
import { resend } from "@/lib/resend";
import { render } from "@react-email/components";

const EMAIL_FROM = "Acme <onboarding@resend.dev>";
const APP_NAME = "SoftwareCrafting Tools";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  userId?: string;
  type: "invoice" | "verification" | "password_reset";
  referenceId?: string;
  referenceType?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
  }[];
}

async function sendEmail({
  to,
  subject,
  html,
  userId,
  type,
  referenceId,
  referenceType,
  attachments,
}: SendEmailOptions) {
  const fullSubject = `${subject} - ${APP_NAME}`;

  const log = await createEmailLog({
    userId,
    type,
    toEmail: to,
    subject: fullSubject,
    status: "sent",
    referenceId,
    referenceType,
  });

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: fullSubject,
      html,
      attachments,
    });

    if (error) {
      await updateEmailLogStatus(log.id, "failed", undefined, error.message);

      logger.error("Email send error", { error, logId: log.id });

      return { data: null, error };
    }

    await updateEmailLogStatus(log.id, "sent", data?.id);

    return { data, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    await updateEmailLogStatus(log.id, "failed", undefined, message);

    logger.error("Email send exception", { error, logId: log.id });

    return {
      data: null,
      error: error instanceof Error ? error : new Error(message),
    };
  }
}

export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationUrl: string,
  userId?: string,
) {
  const html = await render(
    VerificationEmail({ name: name || "there", verificationUrl }),
  );

  return sendEmail({
    to: email,
    subject: "Verify your email",
    html,
    userId,
    type: "verification",
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string,
  userId?: string,
) {
  const html = await render(
    PasswordResetEmail({ name: name || "there", resetUrl }),
  );

  return sendEmail({
    to: email,
    subject: "Reset your password",
    html,
    userId,
    type: "password_reset",
  });
}

export async function sendInvoiceEmail({
  email,
  businessName,
  invoiceNumber,
  amount,
  message,
  pdfBuffer,
  userId,
  invoiceId,
}: {
  email: string;
  businessName: string;
  invoiceNumber: string;
  amount: string;
  message?: string;
  pdfBuffer: Buffer;
  userId: string;
  invoiceId: string;
}) {
  const html = await render(
    InvoiceEmail({ businessName, invoiceNumber, amount, message }),
  );

  return sendEmail({
    to: email,
    subject: `Invoice ${invoiceNumber} from ${businessName}`,
    html,
    userId,
    type: "invoice",
    referenceId: invoiceId,
    referenceType: "invoice",
    attachments: [
      {
        filename: `Invoice-${invoiceNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
