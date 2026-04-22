import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
] as const;

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
      }
    ),
});

export type FileUploadInput = z.infer<typeof FileUploadSchema>;
