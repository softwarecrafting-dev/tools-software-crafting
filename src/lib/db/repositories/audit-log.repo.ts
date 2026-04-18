import { db } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";
import type { AuditLogRecord, NewAuditLog } from "./types";

export async function createAuditLog(
  data: NewAuditLog,
): Promise<AuditLogRecord> {
  const [result] = await db.insert(auditLogs).values(data).returning();

  return result;
}
