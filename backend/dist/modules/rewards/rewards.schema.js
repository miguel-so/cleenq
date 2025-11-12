"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardQuerySchema = exports.adjustPointsSchema = exports.rewardSettingsSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
exports.rewardSettingsSchema = zod_1.z.object({
    pointsPerDollar: zod_1.z.number().positive(),
    redemptionThreshold: zod_1.z.number().int().positive(),
    redemptionValue: zod_1.z.number().positive(),
    note: zod_1.z.string().optional(),
});
exports.adjustPointsSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    points: zod_1.z.number().int(),
    type: zod_1.z
        .nativeEnum(client_1.RewardTransactionType)
        .default(client_1.RewardTransactionType.ADJUSTMENT),
    bookingId: zod_1.z.string().uuid().optional(),
    description: zod_1.z.string().optional(),
});
exports.rewardQuerySchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid().optional(),
    type: zod_1.z.nativeEnum(client_1.RewardTransactionType).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(50),
    cursor: zod_1.z.string().uuid().optional(),
});
