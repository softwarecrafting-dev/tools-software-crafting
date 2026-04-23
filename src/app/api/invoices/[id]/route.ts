import { env } from "@/lib/env";
import { InvoiceNumberTakenError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import {
  parseBody,
  parseParams,
  ValidationError,
} from "@/lib/middleware/validate";
import {
  deleteInvoice,
  getInvoice,
  updateInvoice,
} from "@/lib/services/invoice.service";
import { IdParamSchema } from "@/lib/validators/common";
import { InvoiceUpdateSchema } from "@/lib/validators/invoice";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    const { userId } = await requireAuth();
    const { id } = await parseParams(params, IdParamSchema);

    await applyRateLimit(`invoice:get:${userId}:${id}`, {
      name: "invoice_get",
      points: env.NODE_ENV === "development" ? 60 : 30,
      duration: 60,
    });

    const invoice = await getInvoice(id, userId, { ipAddress: ip, userAgent });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: unknown) {
    return handleRouteError(error, "Invoice fetch error");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    const { userId } = await requireAuth();
    const { id } = await parseParams(params, IdParamSchema);

    await applyRateLimit(`invoice:update:${userId}:${id}`, {
      name: "invoice_update",
      points: env.NODE_ENV === "development" ? 50 : 20,
      duration: 60,
    });

    const body = await parseBody(request, InvoiceUpdateSchema);

    const invoice = await updateInvoice(id, userId, body, {
      ipAddress: ip,
      userAgent,
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: unknown) {
    return handleRouteError(error, "Invoice update error");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    const { userId } = await requireAuth();
    const { id } = await parseParams(params, IdParamSchema);

    await applyRateLimit(`invoice:delete:${userId}:${id}`, {
      name: "invoice_delete",
      points: env.NODE_ENV === "development" ? 20 : 10,
      duration: 60,
    });

    await deleteInvoice(id, userId, { ipAddress: ip, userAgent });

    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (error: unknown) {
    return handleRouteError(error, "Invoice delete error");
  }
}

function handleRouteError(error: unknown, logPrefix: string) {
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      { success: false, error: "Too many requests", code: "RATE_LIMITED" },
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

  if (error instanceof InvoiceNumberTakenError) {
    return NextResponse.json(
      { success: false, error: error.message, code: "INVOICE_NUMBER_TAKEN" },
      { status: 409 },
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

  logger.error(logPrefix, { error });

  return NextResponse.json(
    { success: false, error: "Internal server error", code: "INTERNAL_ERROR" },
    { status: 500 },
  );
}
