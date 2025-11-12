"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerMembershipSchema = exports.assignMembershipSchema = exports.updateMembershipPlanSchema = exports.membershipPlanSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("../../generated/prisma/client");
const money = zod_1.z.number().nonnegative().optional();
exports.membershipPlanSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    slug: zod_1.z.string().min(2),
    tierLevel: zod_1.z.number().int().min(0),
    minPoints: zod_1.z.number().int().min(0),
    maxPoints: zod_1.z.number().int().min(0).nullable().optional(),
    discountPercent: zod_1.z.number().min(0).max(100).default(0),
    monthlyFee: money,
    annualFee: money,
    perks: zod_1.z.array(zod_1.z.string().min(2)).default([]),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateMembershipPlanSchema = exports.membershipPlanSchema.partial();
exports.assignMembershipSchema = zod_1.z.object({
    customerId: zod_1.z.string().uuid(),
    membershipPlanId: zod_1.z.string().uuid(),
    status: zod_1.z.nativeEnum(client_1.MembershipStatus).default(client_1.MembershipStatus.ACTIVE),
    expiresAt: zod_1.z.union([zod_1.z.string(), zod_1.z.date()]).transform((val) => val ? new Date(val) : undefined),
    autoRenew: zod_1.z.boolean().optional(),
    notes: zod_1.z.string().optional(),
});
exports.updateCustomerMembershipSchema = exports.assignMembershipSchema
    .partial()
    .extend({
    status: zod_1.z.nativeEnum(client_1.MembershipStatus).optional(),
});
