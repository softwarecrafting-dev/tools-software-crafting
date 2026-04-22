import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";
import { logger } from "./logger";

function createR2Client() {
  try {
    return new S3Client({
      region: "auto",
      endpoint: env.R2_ENDPOINT,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  } catch (error) {
    logger.error("Failed to initialize R2 S3 Client", { error });

    throw error;
  }
}

export const r2 = createR2Client();

export const R2_BUCKET_NAME = env.R2_BUCKET_NAME;
export const R2_PUBLIC_DOMAIN = env.R2_PUBLIC_DOMAIN;
