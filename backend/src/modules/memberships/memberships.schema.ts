import { z } from "zod";
import { MembershipStatus } from "../../generated/prisma/client";

const money = z.number().nonnegative().optional();

export const membershipPlanSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  tierLevel: z.number().int().min(0),
  minPoints: z.number().int().min(0),
  maxPoints: z.number().int().min(0).nullable().optional(),
  discountPercent: z.number().min(0).max(100).default(0),
  monthlyFee: money,
  annualFee: money,
  perks: z.array(z.string().min(2)).default([]),
  isActive: z.boolean().optional(),
});

export const updateMembershipPlanSchema = membershipPlanSchema.partial();

export const assignMembershipSchema = z.object({
  customerId: z.string().uuid(),
  membershipPlanId: z.string().uuid(),
  status: z.nativeEnum(MembershipStatus).default(MembershipStatus.ACTIVE),
  expiresAt: z.union([z.string(), z.date()]).transform((val) =>
    val ? new Date(val) : undefined,
  ),
  autoRenew: z.boolean().optional(),
  notes: z.string().optional(),
});

export const updateCustomerMembershipSchema = assignMembershipSchema
  .partial()
  .extend({
    status: z.nativeEnum(MembershipStatus).optional(),
  });

export type MembershipPlanInput = z.infer<typeof membershipPlanSchema>;
export type UpdateMembershipPlanInput = z.infer<
  typeof updateMembershipPlanSchema
>;
export type AssignMembershipInput = z.infer<typeof assignMembershipSchema>;
export type UpdateCustomerMembershipInput = z.infer<
  typeof updateCustomerMembershipSchema
>;

