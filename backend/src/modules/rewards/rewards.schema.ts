import { z } from "zod";
import { RewardTransactionType } from "../../generated/prisma/client";

export const rewardSettingsSchema = z.object({
  pointsPerDollar: z.number().positive(),
  redemptionThreshold: z.number().int().positive(),
  redemptionValue: z.number().positive(),
  note: z.string().optional(),
});

export const adjustPointsSchema = z.object({
  customerId: z.string().uuid(),
  points: z.number().int(),
  type: z
    .nativeEnum(RewardTransactionType)
    .default(RewardTransactionType.ADJUSTMENT),
  bookingId: z.string().uuid().optional(),
  description: z.string().optional(),
});

export const rewardQuerySchema = z.object({
  customerId: z.string().uuid().optional(),
  type: z.nativeEnum(RewardTransactionType).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().uuid().optional(),
});

export type RewardSettingsInput = z.infer<typeof rewardSettingsSchema>;
export type RewardQueryInput = z.infer<typeof rewardQuerySchema>;
export type AdjustPointsInput = z.infer<typeof adjustPointsSchema>;

