import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { getNextInvoiceNumber } from "@/lib/services/invoice.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await requireAuth();

    await applyRateLimit(`invoices:next-number:${userId}`, {
      name: "invoices_next_number",
      points: 60,
      duration: 60,
    });

    const nextNumber = await getNextInvoiceNumber(userId);

    logger.info("Generated next invoice number", { userId, nextNumber });

    return NextResponse.json({ success: true, invoiceNumber: nextNumber });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
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

    logger.error("Failed to get next invoice number route", { error });

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
