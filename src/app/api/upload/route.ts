import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseFormData, ValidationError } from "@/lib/middleware/validate";
import { StorageError, uploadFile } from "@/lib/services/storage.service";
import { FileUploadSchema } from "@/lib/validators/file";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth();

    await applyRateLimit(`upload:${userId}`, {
      name: "file_upload",
      points: env.NODE_ENV === "development" ? 50 : 10,
      duration: 60,
    });

    const { file } = await parseFormData(req, FileUploadSchema);
    const fileRecord = await uploadFile(userId, file);

    return NextResponse.json({ success: true, data: fileRecord });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: error.details[0].message,
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      );
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many uploads. Try again later.",
          code: "RATE_LIMITED",
        },
        { status: 429, headers: { "Retry-After": String(error.retryAfter) } }
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    if (error instanceof StorageError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status }
      );
    }

    logger.error("Upload route failure", { error });
    const message = error instanceof Error ? error.message : "Internal Error";

    return NextResponse.json(
      { success: false, error: message, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
