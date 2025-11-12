"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMembershipPlans = listMembershipPlans;
exports.createMembershipPlan = createMembershipPlan;
exports.updateMembershipPlan = updateMembershipPlan;
exports.deleteMembershipPlan = deleteMembershipPlan;
exports.listCustomerMemberships = listCustomerMemberships;
exports.assignMembership = assignMembership;
exports.updateCustomerMembership = updateCustomerMembership;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
const toDecimal = (value) => value !== undefined && value !== null
    ? new client_1.Prisma.Decimal(value)
    : undefined;
function listMembershipPlans() {
    return prisma_1.default.membershipPlan.findMany({
        orderBy: { tierLevel: "asc" },
    });
}
async function createMembershipPlan(input) {
    return prisma_1.default.membershipPlan.create({
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
async function updateMembershipPlan(planId, input) {
    const data = {};
    if (input.name)
        data.name = input.name;
    if (input.slug)
        data.slug = input.slug;
    if (input.tierLevel !== undefined)
        data.tierLevel = input.tierLevel;
    if (input.minPoints !== undefined)
        data.minPoints = input.minPoints;
    if (input.maxPoints !== undefined)
        data.maxPoints = input.maxPoints;
    if (input.discountPercent !== undefined)
        data.discountPercent = input.discountPercent;
    if (input.monthlyFee !== undefined)
        data.monthlyFee = toDecimal(input.monthlyFee);
    if (input.annualFee !== undefined)
        data.annualFee = toDecimal(input.annualFee);
    if (input.perks !== undefined)
        data.perks = input.perks;
    if (input.isActive !== undefined)
        data.isActive = input.isActive;
    return prisma_1.default.membershipPlan.update({
        where: { id: planId },
        data,
    });
}
async function deleteMembershipPlan(planId) {
    const activeMemberships = await prisma_1.default.customerMembership.count({
        where: {
            membershipPlanId: planId,
            status: {
                in: ["ACTIVE", "PAUSED"],
            },
        },
    });
    if (activeMemberships > 0) {
        throw new app_error_1.default("Cannot delete membership plan with active members. Deactivate or migrate members first.", 409);
    }
    await prisma_1.default.membershipPlan.delete({
        where: { id: planId },
    });
}
function listCustomerMemberships() {
    return prisma_1.default.customerMembership.findMany({
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
async function assignMembership(input) {
    return prisma_1.default.customerMembership.create({
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
async function updateCustomerMembership(membershipId, input) {
    const data = {};
    if (input.customerId) {
        data.customer = { connect: { id: input.customerId } };
    }
    if (input.membershipPlanId) {
        data.membershipPlan = { connect: { id: input.membershipPlanId } };
    }
    if (input.status)
        data.status = input.status;
    if (input.expiresAt !== undefined)
        data.expiresAt = input.expiresAt;
    if (input.autoRenew !== undefined)
        data.autoRenew = input.autoRenew;
    if (input.notes !== undefined)
        data.notes = input.notes;
    return prisma_1.default.customerMembership.update({
        where: { id: membershipId },
        data,
        include: {
            customer: true,
            membershipPlan: true,
        },
    });
}
