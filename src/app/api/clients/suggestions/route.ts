import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseQuery, ValidationError } from "@/lib/middleware/validate";
import { getClientSuggestions } from "@/lib/services/invoice.service";
import type { NextRequest } from "next/server";
import * as z from "zod";

const SuggestionsQuerySchema = z.object({
  q: z.string().max(100).default(""),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireAuth();

    await applyRateLimit(`clients:suggestions:${userId}`, {
      name: "clients_suggestions",
      points: env.NODE_ENV === "development" ? 100 : 30,
      duration: 60,
    });

    const { q } = await parseQuery(request, SuggestionsQuerySchema);

    const suggestions = await getClientSuggestions(userId, q);

    logger.info("Client suggestions fetched", {
      userId,
      query: q,
      count: suggestions.length,
    });

    return Response.json({ success: true, data: suggestions });
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
        }
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
        { status: 400 }
      );
    }

    if (error instanceof AuthError) {
      return Response.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (error instanceof ForbiddenError) {
      return Response.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    logger.error("Client suggestions route error", {
      route: "/api/clients/suggestions",
      error,
    });

    return Response.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
