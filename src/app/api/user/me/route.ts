import { logger } from "@/lib/logger";
import { AuthError, requireAuth } from "@/lib/middleware/auth";
import { findUserById, mapToSafeUser } from "@/lib/db/repositories/user.repo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireAuth();
    const user = await findUserById(session.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: mapToSafeUser(user),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    logger.error("GET /api/user/me error", { error });

    return NextResponse.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
