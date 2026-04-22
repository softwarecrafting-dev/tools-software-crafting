import { createFileRecord } from "@/lib/db/repositories/file.repo";
import type { UploadedFile } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import { ALLOWED_FILE_TYPES } from "@/lib/validators/file";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from "file-type";
import { nanoid } from "nanoid";

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = "StorageError";
  }
}

async function ensureBucketExists(): Promise<void> {
  try {
    await r2.send(new HeadBucketCommand({ Bucket: R2_BUCKET_NAME }));
  } catch (error: unknown) {
    const s3Error = error as {
      name?: string;
      $metadata?: { httpStatusCode?: number };
    };
    if (
      s3Error.name === "NotFound" ||
      s3Error.$metadata?.httpStatusCode === 404
    ) {
      logger.info("Provisioning R2 bucket", { bucket: R2_BUCKET_NAME });

      await r2.send(new CreateBucketCommand({ Bucket: R2_BUCKET_NAME }));
    } else {
      throw error;
    }
  }
}

export async function uploadFile(
  userId: string,
  file: File,
): Promise<UploadedFile> {
  try {
    await ensureBucketExists();

    const buffer = Buffer.from(await file.arrayBuffer());
    const typeInfo = await fileTypeFromBuffer(buffer);

    if (
      !typeInfo ||
      !(ALLOWED_FILE_TYPES as readonly string[]).includes(typeInfo.mime)
    ) {
      throw new StorageError(
        "Invalid or unsupported file type detected from content",
        "INVALID_FILE_CONTENT",
      );
    }

    const key = `invoices/${userId}/${nanoid()}.${typeInfo.ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: typeInfo.mime,
      }),
    );

    const publicDomain = env.R2_PUBLIC_DOMAIN;
    const url = publicDomain
      ? `${publicDomain}/${key}`
      : `${env.NEXT_PUBLIC_APP_URL}/api/files/${key}`;

    const record = await createFileRecord({
      userId,
      name: file.name,
      size: file.size,
      type: typeInfo.mime,
      key,
      url,
    });

    logger.info("File upload complete", {
      userId,
      fileId: record.id,
      mime: typeInfo.mime,
    });

    return record;
  } catch (error) {
    if (error instanceof StorageError) throw error;

    logger.error("Storage service upload failure", { userId, error });
    throw error;
  }
}
