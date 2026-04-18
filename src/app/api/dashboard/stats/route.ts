import { logger } from "@/lib/logger";
import { AuthError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { DashboardService } from "@/lib/services/dashboard.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();

    await applyRateLimit(`dashboard_stats:${session.userId}`, {
      name: "dashboard_stats",
      points: 20,
      duration: 60,
    });

    const stats = await DashboardService.getStats(session.userId);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          success: false,
          code: "TOO_MANY_REQUESTS",
          error: `Too many attempts. Please try again in ${error.retryAfter}s`,
        },
        {
          status: 429,
          headers: { "Retry-After": error.retryAfter.toString() },
        },
      );
    }

    logger.error("GET /api/dashboard/stats error", { error });

    return NextResponse.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
