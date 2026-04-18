import { db } from "@/lib/db/client";
import { userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NewUserSettings, UserSettingsRecord } from "./types";

export async function findSettingsByUserId(
  userId: string,
): Promise<UserSettingsRecord | undefined> {
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  return settings;
}

export async function upsertSettings(
  userId: string,
  data: Partial<NewUserSettings>,
): Promise<UserSettingsRecord> {
  const now = new Date();

  const [settings] = await db
    .insert(userSettings)
    .values({
      ...data,
      userId,
      updatedAt: now,
    } as NewUserSettings)
    .onConflictDoUpdate({
      target: userSettings.userId,
      set: {
        ...data,
        updatedAt: now,
      },
    })
    .returning();

  return settings;
}
