import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/app-error";
import type {
  AssignMembershipInput,
  MembershipPlanInput,
  UpdateCustomerMembershipInput,
  UpdateMembershipPlanInput,
} from "./memberships.schema";

const toDecimal = (value?: number | null) =>
  value !== undefined && value !== null
    ? new Prisma.Decimal(value)
    : undefined;

export function listMembershipPlans() {
  return prisma.membershipPlan.findMany({
    orderBy: { tierLevel: "asc" },
  });
}

export async function createMembershipPlan(input: MembershipPlanInput) {
  return prisma.membershipPlan.create({
    data: {
      name: input.name,
      slug: input.slug,
      tierLevel: input.tierLevel,
      minPoints: input.minPoints,
      maxPoints: input.maxPoints ?? undefined,
      discountPercent: input.discountPercent,
      monthlyFee: toDecimal(input.monthlyFee ?? null),
      annualFee: toDecimal(input.annualFee ?? null),
      perks: input.perks ?? [],
      isActive: input.isActive ?? true,
    },
  });
}

export async function updateMembershipPlan(
  planId: string,
  input: UpdateMembershipPlanInput,
) {
  const data: Prisma.MembershipPlanUpdateInput = {};

  if (input.name) data.name = input.name;
  if (input.slug) data.slug = input.slug;
  if (input.tierLevel !== undefined) data.tierLevel = input.tierLevel;
  if (input.minPoints !== undefined) data.minPoints = input.minPoints;
  if (input.maxPoints !== undefined) data.maxPoints = input.maxPoints;
  if (input.discountPercent !== undefined)
    data.discountPercent = input.discountPercent;
  if (input.monthlyFee !== undefined)
    data.monthlyFee = toDecimal(input.monthlyFee);
  if (input.annualFee !== undefined)
    data.annualFee = toDecimal(input.annualFee);
  if (input.perks !== undefined) data.perks = input.perks;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.membershipPlan.update({
    where: { id: planId },
    data,
  });
}

export async function deleteMembershipPlan(planId: string) {
  const activeMemberships = await prisma.customerMembership.count({
    where: {
      membershipPlanId: planId,
      status: {
        in: ["ACTIVE", "PAUSED"],
      },
    },
  });

  if (activeMemberships > 0) {
    throw new AppError(
      "Cannot delete membership plan with active members. Deactivate or migrate members first.",
      409,
    );
  }

  await prisma.membershipPlan.delete({
    where: { id: planId },
  });
}

export function listCustomerMemberships() {
  return prisma.customerMembership.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      membershipPlan: true,
    },
  });
}

export async function assignMembership(input: AssignMembershipInput) {
  return prisma.customerMembership.create({
    data: {
      customerId: input.customerId,
      membershipPlanId: input.membershipPlanId,
      status: input.status,
      expiresAt: input.expiresAt,
      autoRenew: input.autoRenew ?? false,
      notes: input.notes,
    },
    include: {
      customer: true,
      membershipPlan: true,
    },
  });
}

export async function updateCustomerMembership(
  membershipId: string,
  input: UpdateCustomerMembershipInput,
) {
  const data: Prisma.CustomerMembershipUpdateInput = {};

  if (input.customerId) {
    data.customer = { connect: { id: input.customerId } };
  }
  if (input.membershipPlanId) {
    data.membershipPlan = { connect: { id: input.membershipPlanId } };
  }
  if (input.status) data.status = input.status;
  if (input.expiresAt !== undefined) data.expiresAt = input.expiresAt;
  if (input.autoRenew !== undefined) data.autoRenew = input.autoRenew;
  if (input.notes !== undefined) data.notes = input.notes;

  return prisma.customerMembership.update({
    where: { id: membershipId },
    data,
    include: {
      customer: true,
      membershipPlan: true,
    },
  });
}

