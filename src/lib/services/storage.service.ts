import { createFileRecord } from "@/lib/db/repositories/file.repo";
import type { UploadedFile } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { r2, R2_BUCKET_NAME } from "@/lib/r2";
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

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
    const fileExtension = file.name.split(".").pop();
    const key = `invoices/${userId}/${nanoid()}.${fileExtension}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
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
      type: file.type,
      key,
      url,
    });

    logger.info("File upload complete", { userId, fileId: record.id, key });

    return record;
  } catch (error) {
    logger.error("Storage service upload failure", { userId, error });
    throw error;
  }
}
