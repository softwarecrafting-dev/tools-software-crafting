import { db } from "@/lib/db/client";
import { emailLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { EmailLogRecord, NewEmailLog } from "./types";

export async function createEmailLog(
  data: NewEmailLog,
): Promise<EmailLogRecord> {
  const [result] = await db.insert(emailLogs).values(data).returning();

  return result;
}

export async function updateEmailLogStatus(
  id: string,
  status: "sent" | "delivered" | "bounced" | "failed",
  resendId?: string,
  errorMessage?: string,
): Promise<EmailLogRecord | undefined> {
  const [result] = await db
    .update(emailLogs)
    .set({
      status,
      resendId: resendId ?? undefined,
      errorMessage: errorMessage ?? undefined,
    })
    .where(eq(emailLogs.id, id))
    .returning();

  return result;
}
