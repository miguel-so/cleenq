"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRewardSettings = getRewardSettings;
exports.updateRewardSettings = updateRewardSettings;
exports.listRewardTransactions = listRewardTransactions;
exports.getCustomerRewardSummary = getCustomerRewardSummary;
exports.adjustRewardPoints = adjustRewardPoints;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
const DEFAULT_REWARD_SETTINGS = {
    pointsPerDollar: 1,
    redemptionThreshold: 500,
    redemptionValue: 25,
    note: "CleenQ loyalty program: 1 point per $1, 500 points = $25 credit.",
};
async function getRewardSettings() {
    const settings = await prisma_1.default.rewardSetting.findUnique({
        where: { id: 1 },
    });
    if (settings) {
        return settings;
    }
    return prisma_1.default.rewardSetting.create({
        data: {
            id: 1,
            ...DEFAULT_REWARD_SETTINGS,
            redemptionValue: new client_1.Prisma.Decimal(DEFAULT_REWARD_SETTINGS.redemptionValue),
        },
    });
}
async function updateRewardSettings(input) {
    return prisma_1.default.rewardSetting.upsert({
        where: { id: 1 },
        update: {
            pointsPerDollar: input.pointsPerDollar,
            redemptionThreshold: input.redemptionThreshold,
            redemptionValue: new client_1.Prisma.Decimal(input.redemptionValue),
            note: input.note,
        },
        create: {
            id: 1,
            pointsPerDollar: input.pointsPerDollar,
            redemptionThreshold: input.redemptionThreshold,
            redemptionValue: new client_1.Prisma.Decimal(input.redemptionValue),
            note: input.note,
        },
    });
}
async function listRewardTransactions(query) {
    const { customerId, type, limit, cursor } = query;
    const where = {
        customerId,
        type,
    };
    const [transactions, total] = await prisma_1.default.$transaction([
        prisma_1.default.rewardTransaction.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                booking: {
                    select: {
                        id: true,
                        reference: true,
                        status: true,
                    },
                },
                processedByAdmin: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        }),
        prisma_1.default.rewardTransaction.count({ where }),
    ]);
    const nextCursor = transactions.length === limit
        ? transactions[transactions.length - 1]?.id
        : undefined;
    return {
        data: transactions,
        meta: {
            total,
            limit,
            cursor: cursor ?? null,
            nextCursor: nextCursor ?? null,
            hasMore: Boolean(nextCursor),
        },
    };
}
async function getCustomerRewardSummary(customerId) {
    const aggregate = await prisma_1.default.rewardTransaction.aggregate({
        where: { customerId },
        _sum: { points: true },
    });
    const balance = aggregate._sum.points ?? 0;
    const settings = await getRewardSettings();
    const redeemable = Math.floor(balance / settings.redemptionThreshold) * Number(settings.redemptionValue);
    return {
        balance,
        redeemableValue: redeemable,
        threshold: settings.redemptionThreshold,
    };
}
async function adjustRewardPoints(input, adminId) {
    if (input.type === client_1.RewardTransactionType.REDEEM &&
        input.points >= 0) {
        throw new app_error_1.default("Redemption requires negative points value", 400);
    }
    if (input.type === client_1.RewardTransactionType.EARN && input.points <= 0) {
        throw new app_error_1.default("Earning points requires a positive value", 400);
    }
    const customer = await prisma_1.default.customer.findUnique({
        where: { id: input.customerId },
    });
    if (!customer) {
        throw new app_error_1.default("Customer not found", 404);
    }
    if (input.bookingId) {
        const bookingExists = await prisma_1.default.booking.findUnique({
            where: { id: input.bookingId },
        });
        if (!bookingExists) {
            throw new app_error_1.default("Booking not found", 404);
        }
    }
    return prisma_1.default.rewardTransaction.create({
        data: {
            customerId: input.customerId,
            bookingId: input.bookingId,
            processedByAdminId: adminId,
            points: input.points,
            type: input.type,
            description: input.description,
        },
    });
}
