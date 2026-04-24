import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import {
  parseBody,
  parseParams,
  ValidationError,
} from "@/lib/middleware/validate";
import { sendInvoice } from "@/lib/services/invoice.service";
import { IdParamSchema } from "@/lib/validators/common";
import { InvoiceSendSchema } from "@/lib/validators/invoice";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    const { userId } = await requireAuth();
    const { id } = await parseParams(params, IdParamSchema);

    await applyRateLimit(`invoice:send:${userId}:${id}`, {
      name: "invoice_send",
      points: env.NODE_ENV === "development" ? 50 : 5,
      duration: 60 * 60, // 5 sends per hour per invoice
    });

    const body = await parseBody(request, InvoiceSendSchema);

    const invoice = await sendInvoice(id, userId, body, {
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully",
      data: {
        status: invoice.status,
        sentAt: invoice.sentAt,
      },
    });
  } catch (error: unknown) {
    return handleRouteError(error, "Invoice send error");
  }
}

function handleRouteError(error: unknown, logPrefix: string) {
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        success: false,
        error: "Email limit exceeded. Please try again later.",
        code: "RATE_LIMITED",
      },
      { status: 429, headers: { "Retry-After": String(error.retryAfter) } },
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.details,
      },
      { status: 400 },
    );
  }

  if (error instanceof AuthError) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { success: false, error: "Forbidden", code: "FORBIDDEN" },
      { status: 403 },
    );
  }

  const message =
    error instanceof Error ? error.message : "Internal server error";

  if (message === "Invoice not found") {
    return NextResponse.json(
      { success: false, error: message, code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  logger.error(logPrefix, { error });

  return NextResponse.json(
    { success: false, error: "Failed to send invoice", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}
