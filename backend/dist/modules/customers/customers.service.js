"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCustomers = listCustomers;
exports.getCustomer = getCustomer;
exports.createCustomer = createCustomer;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
async function listCustomers(query) {
    const where = query.search
        ? {
            OR: [
                {
                    firstName: {
                        contains: query.search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
                {
                    lastName: {
                        contains: query.search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
                {
                    email: {
                        contains: query.search,
                        mode: client_1.Prisma.QueryMode.insensitive,
                    },
                },
            ],
        }
        : undefined;
    const [customers, total] = await prisma_1.default.$transaction([
        prisma_1.default.customer.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            cursor: query.cursor ? { id: query.cursor } : undefined,
            include: {
                memberships: {
                    include: { membershipPlan: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        }),
        prisma_1.default.customer.count({ where }),
    ]);
    const nextCursor = customers.length === query.limit
        ? customers[customers.length - 1]?.id
        : undefined;
    return {
        data: customers,
        meta: {
            total,
            limit: query.limit,
            cursor: query.cursor ?? null,
            nextCursor: nextCursor ?? null,
            hasMore: Boolean(nextCursor),
        },
    };
}
async function getCustomer(id) {
    const customer = await prisma_1.default.customer.findUnique({
        where: { id },
        include: {
            memberships: {
                include: { membershipPlan: true },
                orderBy: { createdAt: "desc" },
            },
            bookings: {
                select: {
                    id: true,
                    reference: true,
                    status: true,
                    scheduledAt: true,
                    total: true,
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            rewardTransactions: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
        },
    });
    if (!customer) {
        throw new app_error_1.default("Customer not found", 404);
    }
    const points = await prisma_1.default.rewardTransaction.aggregate({
        where: { customerId: id },
        _sum: { points: true },
    });
    return {
        ...customer,
        rewardPoints: points._sum.points ?? 0,
    };
}
async function createCustomer(input) {
    return prisma_1.default.customer.create({
        data: input,
    });
}
async function updateCustomer(id, input) {
    return prisma_1.default.customer.update({
        where: { id },
        data: input,
    });
}
async function deleteCustomer(id) {
    const bookings = await prisma_1.default.booking.count({
        where: { customerId: id },
    });
    if (bookings > 0) {
        throw new app_error_1.default("Cannot delete customer with existing bookings. Archive instead.", 409);
    }
    await prisma_1.default.customer.delete({
        where: { id },
    });
}
