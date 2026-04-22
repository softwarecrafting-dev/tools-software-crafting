import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
] as const;

export type AllowedMimeType = (typeof ALLOWED_FILE_TYPES)[number];

export const ACCEPTED_DROPZONE_TYPES: Record<string, string[]> = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "application/pdf": [".pdf"],
};

export const FileUploadSchema = z.object({
  file: z
    .custom<File>((val) => val instanceof File, "Missing file")
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
    })
    .refine(
      (file) => (ALLOWED_FILE_TYPES as readonly string[]).includes(file.type),
      {
        message: "File type not supported. Use PNG, JPEG, or PDF.",
      },
    ),
});
