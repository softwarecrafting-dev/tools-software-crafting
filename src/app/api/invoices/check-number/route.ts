import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseQuery, ValidationError } from "@/lib/middleware/validate";
import { checkInvoiceNumberExists } from "@/lib/services/invoice.service";
import type { NextRequest } from "next/server";
import * as z from "zod";

const CheckNumberSchema = z.object({
  invoiceNumber: z.string().trim().min(1).max(50),
});

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const { userId } = await requireAuth();

    await applyRateLimit(`invoices:check-number:${userId}`, {
      name: "invoices_check_number",
      points: env.NODE_ENV === "development" ? 60 : 30,
      duration: 60,
    });

    const { invoiceNumber } = await parseQuery(request, CheckNumberSchema);

    const exists = await checkInvoiceNumberExists(userId, invoiceNumber);

    logger.info("Invoice number check", { userId, invoiceNumber, exists });

    return Response.json({ success: true, exists });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return Response.json(
        {
          success: false,
          error: "Too many requests. Try again later.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: { "Retry-After": String(error.retryAfter) },
        },
      );
    }

    if (error instanceof ValidationError) {
      return Response.json(
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
      return Response.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    if (error instanceof ForbiddenError) {
      return Response.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    logger.error("Invoice check-number route error", {
      route: "/api/invoices/check-number",
      ip,
      error,
    });

    return Response.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
