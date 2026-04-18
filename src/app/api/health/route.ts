import { db } from "@/lib/db/client";
import { logger } from "@/lib/logger";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);

    logger.info("Health check passed", { route: "/api/health" });

    return Response.json({
      success: true,
      data: {
        status: "ok",
        db: "connected",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    logger.error("Health check failed", { route: "/api/health", error });

    return Response.json(
      {
        success: false,
        data: {
          status: "error",
          db: "error",
          timestamp: new Date().toISOString(),
        },
      },

      { status: 503 },
    );
  }
}
