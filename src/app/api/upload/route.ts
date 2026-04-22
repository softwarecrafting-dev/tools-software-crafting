import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { uploadFile, StorageError } from "@/lib/services/storage.service";
import { FileUploadSchema } from "@/lib/validators/file";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await requireAuth();

    await applyRateLimit(`upload:${userId}`, {
      name: "file_upload",
      points: 10,
      duration: 60,
    });

    const formData = await req.formData();
    const rawFile = formData.get("file");

    const validation = FileUploadSchema.safeParse({ file: rawFile });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0].message,
          code: "VALIDATION_ERROR",
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const fileRecord = await uploadFile(userId, validation.data.file);

    return NextResponse.json({
      success: true,
      data: fileRecord,
    });
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many uploads. Try again later.",
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

    if (error instanceof StorageError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.status },
      );
    }

    const message = error instanceof Error ? error.message : "Internal Error";

    logger.error("Upload route failure", { error });

    return NextResponse.json(
      {
        success: false,
        error: message,
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
