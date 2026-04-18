import {
  findSettingsByUserId,
  upsertSettings,
} from "@/lib/db/repositories/settings.repo";
import type {
  NewUserSettings,
  UserSettingsRecord,
} from "@/lib/db/repositories/types";
import { updateOnboardingStatus } from "@/lib/db/repositories/user.repo";
import { logger } from "@/lib/logger";
import { logAudit } from "./audit.service";

export async function getSettings(
  userId: string,
): Promise<UserSettingsRecord | undefined> {
  return findSettingsByUserId(userId);
}

export async function updateSettings(
  userId: string,
  data: Partial<NewUserSettings>,
  options?: { ipAddress?: string; userAgent?: string },
): Promise<UserSettingsRecord> {
  try {
    const settings = await upsertSettings(userId, data);

    await logAudit("settings_updated", {
      userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: data,
    });

    logger.info("User settings updated", { userId });

    return settings;
  } catch (error) {
    logger.error("Error in updateSettings service", { userId, error });

    throw error;
  }
}

export async function completeOnboarding(
  userId: string,
  options?: { ipAddress?: string; userAgent?: string },
): Promise<void> {
  try {
    await updateOnboardingStatus(userId, true);

    await logAudit("onboarding_completed", {
      userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    });

    logger.info("User onboarding completed", { userId });
  } catch (error) {
    logger.error("Error in completeOnboarding service", { userId, error });

    throw error;
  }
}
