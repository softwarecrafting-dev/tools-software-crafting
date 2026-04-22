import { db } from "@/lib/db/client";
import { uploadedFiles, type NewUploadedFile } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function createFileRecord(data: NewUploadedFile) {
  const [file] = await db.insert(uploadedFiles).values(data).returning();
  return file;
}

export async function findFileById(id: string) {
  return db.query.uploadedFiles.findFirst({
    where: eq(uploadedFiles.id, id),
  });
}

export async function softDeleteFile(id: string) {
  return db
    .update(uploadedFiles)
    .set({ deletedAt: new Date() })
    .where(eq(uploadedFiles.id, id));
}

export async function linkFilesToInvoice(invoiceId: string, fileIds: string[]) {
  if (fileIds.length === 0) return;

  return db
    .update(uploadedFiles)
    .set({ invoiceId })
    .where(inArray(uploadedFiles.id, fileIds));
}
