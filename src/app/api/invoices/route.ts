import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseQuery, ValidationError } from "@/lib/middleware/validate";
import { getInvoices } from "@/lib/services/invoice.service";
import { InvoiceFiltersSchema } from "@/lib/validators/invoice";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    const { userId } = await requireAuth();

    await applyRateLimit(`invoices:list:${userId}`, {
      name: "invoices_list",
      points: 20,
      duration: 60,
    });

    const filters = await parseQuery(request, InvoiceFiltersSchema);

    const userAgent = request.headers.get("user-agent") ?? undefined;

    const data = await getInvoices(userId, filters, {
      ipAddress: ip,
      userAgent,
    });

    return Response.json({ success: true, data });
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
        {
          success: false,
          error: "Unauthorized",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      );
    }

    if (error instanceof ForbiddenError) {
      return Response.json(
        {
          success: false,
          error: "Forbidden",
          code: "FORBIDDEN",
        },
        { status: 403 },
      );
    }

    logger.error("Invoices list route error", {
      route: "/api/invoices",
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
