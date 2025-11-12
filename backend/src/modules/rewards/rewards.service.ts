import { Prisma, RewardTransactionType } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import type {
  AdjustPointsInput,
  RewardQueryInput,
  RewardSettingsInput,
} from "./rewards.schema";

const DEFAULT_REWARD_SETTINGS: RewardSettingsInput = {
  pointsPerDollar: 1,
  redemptionThreshold: 500,
  redemptionValue: 25,
  note: "CleenQ loyalty program: 1 point per $1, 500 points = $25 credit.",
};

export async function getRewardSettings() {
  const settings = await prisma.rewardSetting.findUnique({
    where: { id: 1 },
  });

  if (settings) {
    return settings;
  }

  return prisma.rewardSetting.create({
    data: {
      id: 1,
      ...DEFAULT_REWARD_SETTINGS,
      redemptionValue: new Prisma.Decimal(
        DEFAULT_REWARD_SETTINGS.redemptionValue,
      ),
    },
  });
}

export async function updateRewardSettings(input: RewardSettingsInput) {
  return prisma.rewardSetting.upsert({
    where: { id: 1 },
    update: {
      pointsPerDollar: input.pointsPerDollar,
      redemptionThreshold: input.redemptionThreshold,
      redemptionValue: new Prisma.Decimal(input.redemptionValue),
      note: input.note,
    },
    create: {
      id: 1,
      pointsPerDollar: input.pointsPerDollar,
      redemptionThreshold: input.redemptionThreshold,
      redemptionValue: new Prisma.Decimal(input.redemptionValue),
      note: input.note,
    },
  });
}

export async function listRewardTransactions(query: RewardQueryInput) {
  const { customerId, type, limit, cursor } = query;

  const where = {
    customerId,
    type,
  };

  const [transactions, total] = await prisma.$transaction([
    prisma.rewardTransaction.findMany({
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
    prisma.rewardTransaction.count({ where }),
  ]);

  const nextCursor =
    transactions.length === limit
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

export async function getCustomerRewardSummary(customerId: string) {
  const aggregate = await prisma.rewardTransaction.aggregate({
    where: { customerId },
    _sum: { points: true },
  });

  const balance = aggregate._sum.points ?? 0;

  const settings = await getRewardSettings();

  const redeemable = Math.floor(
    balance / settings.redemptionThreshold,
  ) * Number(settings.redemptionValue);

  return {
    balance,
    redeemableValue: redeemable,
    threshold: settings.redemptionThreshold,
  };
}

export async function adjustRewardPoints(
  input: AdjustPointsInput,
  adminId: string,
) {
  if (
    input.type === RewardTransactionType.REDEEM &&
    input.points >= 0
  ) {
    throw new AppError("Redemption requires negative points value", 400);
  }

  if (input.type === RewardTransactionType.EARN && input.points <= 0) {
    throw new AppError("Earning points requires a positive value", 400);
  }

  const customer = await prisma.customer.findUnique({
    where: { id: input.customerId },
  });

  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  if (input.bookingId) {
    const bookingExists = await prisma.booking.findUnique({
      where: { id: input.bookingId },
    });

    if (!bookingExists) {
      throw new AppError("Booking not found", 404);
    }
  }

  return prisma.rewardTransaction.create({
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

