"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.getBooking = getBooking;
exports.createBooking = createBooking;
exports.updateBooking = updateBooking;
exports.updateBookingStatus = updateBookingStatus;
exports.assignCleaner = assignCleaner;
exports.updateAssignment = updateAssignment;
exports.getBookingSummary = getBookingSummary;
const client_1 = require("../../generated/prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const app_error_1 = __importDefault(require("../../utils/app-error"));
function toDecimal(value) {
    return value !== undefined ? new client_1.Prisma.Decimal(value) : undefined;
}
function calculateTotals(items, addOns) {
    const itemsTotal = items.reduce((sum, item) => {
        const lineTotal = item.unitPrice * item.quantity - (item.discount ?? 0);
        return sum + lineTotal;
    }, 0);
    const addOnTotal = (addOns ?? []).reduce((sum, addon) => {
        const total = addon.total ??
            addon.unitPrice * (addon.quantity ?? 1);
        return sum + total;
    }, 0);
    const subtotal = itemsTotal + addOnTotal;
    const tax = subtotal * 0.1; // default 10% GST
    const total = subtotal + tax;
    return { subtotal, tax, total };
}
function generateBookingReference() {
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `CLQ-${new Date().getTime().toString().slice(-6)}-${random}`;
}
async function listBookings(query) {
    const where = {};
    if (query.status)
        where.status = query.status;
    if (query.serviceCategoryId)
        where.serviceCategoryId = query.serviceCategoryId;
    if (query.customerId)
        where.customerId = query.customerId;
    if (query.dateFrom || query.dateTo) {
        where.scheduledAt = {
            gte: query.dateFrom ? new Date(query.dateFrom) : undefined,
            lte: query.dateTo ? new Date(query.dateTo) : undefined,
        };
    }
    if (query.search) {
        where.OR = [
            { reference: { contains: query.search } },
            {
                customer: {
                    OR: [
                        { firstName: { contains: query.search } },
                        { lastName: { contains: query.search } },
                        { email: { contains: query.search } },
                    ],
                },
            },
        ];
    }
    const [bookings, total] = await prisma_1.default.$transaction([
        prisma_1.default.booking.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                    },
                },
                serviceCategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                membershipPlan: true,
                items: {
                    include: {
                        servicePackage: {
                            select: {
                                id: true,
                                name: true,
                                priceUnit: true,
                            },
                        },
                    },
                },
                addOns: {
                    include: {
                        serviceAddon: {
                            select: {
                                id: true,
                                name: true,
                                priceUnit: true,
                            },
                        },
                    },
                },
                cleanerAssignments: {
                    include: {
                        cleaner: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: query.limit,
            skip: query.cursor ? 1 : 0,
            cursor: query.cursor ? { id: query.cursor } : undefined,
        }),
        prisma_1.default.booking.count({ where }),
    ]);
    const nextCursor = bookings.length === query.limit
        ? bookings[bookings.length - 1]?.id
        : undefined;
    return {
        data: bookings,
        meta: {
            total,
            limit: query.limit,
            cursor: query.cursor ?? null,
            nextCursor: nextCursor ?? null,
            hasMore: Boolean(nextCursor),
        },
    };
}
async function getBooking(id) {
    const booking = await prisma_1.default.booking.findUnique({
        where: { id },
        include: {
            customer: true,
            serviceCategory: true,
            membershipPlan: true,
            items: {
                include: { servicePackage: true },
            },
            addOns: {
                include: { serviceAddon: true },
            },
            cleanerAssignments: {
                include: { cleaner: true },
            },
            timelineEvents: {
                orderBy: { createdAt: "asc" },
            },
            rewards: true,
        },
    });
    if (!booking) {
        throw new app_error_1.default("Booking not found", 404);
    }
    return booking;
}
async function createBooking(input, adminId) {
    const totals = input.subtotal && input.tax && input.total
        ? {
            subtotal: input.subtotal,
            tax: input.tax,
            total: input.total,
        }
        : calculateTotals(input.items, input.addOns);
    return prisma_1.default.$transaction(async (tx) => {
        const booking = await tx.booking.create({
            data: {
                reference: generateBookingReference(),
                customerId: input.customerId,
                serviceCategoryId: input.serviceCategoryId,
                membershipPlanId: input.membershipPlanId,
                status: input.status,
                scheduledAt: input.scheduledAt,
                durationMinutes: input.durationMinutes,
                notes: input.notes,
                addressLine1: input.addressLine1,
                addressLine2: input.addressLine2,
                suburb: input.suburb,
                state: input.state,
                postcode: input.postcode,
                subtotal: new client_1.Prisma.Decimal(totals.subtotal),
                discount: toDecimal(input.discount ?? 0) ?? new client_1.Prisma.Decimal(0),
                tax: new client_1.Prisma.Decimal(totals.tax),
                total: new client_1.Prisma.Decimal(totals.total),
                approvedByAdminId: adminId,
                items: {
                    create: input.items.map((item) => ({
                        servicePackageId: item.servicePackageId,
                        quantity: item.quantity,
                        unitPrice: new client_1.Prisma.Decimal(item.unitPrice),
                        discount: toDecimal(item.discount ?? 0) ?? new client_1.Prisma.Decimal(0),
                        total: new client_1.Prisma.Decimal(item.unitPrice * item.quantity - (item.discount ?? 0)),
                        metadata: item.metadata,
                    })),
                },
                addOns: input.addOns
                    ? {
                        create: input.addOns.map((addon) => ({
                            serviceAddonId: addon.serviceAddonId,
                            quantity: addon.quantity ?? 1,
                            unitPrice: new client_1.Prisma.Decimal(addon.unitPrice),
                            total: new client_1.Prisma.Decimal(addon.total ??
                                addon.unitPrice * (addon.quantity ?? 1)),
                            metadata: addon.metadata,
                        })),
                    }
                    : undefined,
                timelineEvents: {
                    create: {
                        status: input.status,
                        notes: "Booking created by admin portal",
                    },
                },
            },
            include: {
                customer: true,
                items: true,
                addOns: true,
            },
        });
        return booking;
    });
}
async function updateBooking(bookingId, input, adminId) {
    const booking = await getBooking(bookingId);
    const totals = input.items || input.addOns
        ? calculateTotals(input.items ?? booking.items.map((item) => ({
            servicePackageId: item.servicePackageId,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            discount: Number(item.discount),
            metadata: item.metadata ?? undefined,
        })), input.addOns ??
            booking.addOns.map((addon) => ({
                serviceAddonId: addon.serviceAddonId,
                quantity: addon.quantity,
                unitPrice: Number(addon.unitPrice),
                total: Number(addon.total),
                metadata: addon.metadata ?? undefined,
            })))
        : {
            subtotal: Number(booking.subtotal),
            tax: Number(booking.tax),
            total: Number(booking.total),
        };
    return prisma_1.default.$transaction(async (tx) => {
        if (input.items) {
            await tx.bookingItem.deleteMany({
                where: { bookingId },
            });
        }
        if (input.addOns) {
            await tx.bookingAddon.deleteMany({
                where: { bookingId },
            });
        }
        const updated = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: input.status ?? booking.status,
                serviceCategoryId: input.serviceCategoryId ?? booking.serviceCategoryId,
                membershipPlanId: input.membershipPlanId ?? booking.membershipPlanId,
                scheduledAt: input.scheduledAt ?? booking.scheduledAt,
                durationMinutes: input.durationMinutes ?? booking.durationMinutes,
                notes: input.notes ?? booking.notes,
                addressLine1: input.addressLine1 ?? booking.addressLine1,
                addressLine2: input.addressLine2 ?? booking.addressLine2,
                suburb: input.suburb ?? booking.suburb,
                state: input.state ?? booking.state,
                postcode: input.postcode ?? booking.postcode,
                subtotal: new client_1.Prisma.Decimal(totals.subtotal),
                discount: toDecimal(input.discount ?? Number(booking.discount)) ??
                    booking.discount,
                tax: new client_1.Prisma.Decimal(totals.tax),
                total: new client_1.Prisma.Decimal(totals.total),
                items: input.items
                    ? {
                        create: input.items.map((item) => ({
                            servicePackageId: item.servicePackageId,
                            quantity: item.quantity,
                            unitPrice: new client_1.Prisma.Decimal(item.unitPrice),
                            discount: toDecimal(item.discount ?? 0) ?? new client_1.Prisma.Decimal(0),
                            total: new client_1.Prisma.Decimal(item.unitPrice * item.quantity - (item.discount ?? 0)),
                            metadata: item.metadata,
                        })),
                    }
                    : undefined,
                addOns: input.addOns
                    ? {
                        create: input.addOns.map((addon) => ({
                            serviceAddonId: addon.serviceAddonId,
                            quantity: addon.quantity ?? 1,
                            unitPrice: new client_1.Prisma.Decimal(addon.unitPrice),
                            total: new client_1.Prisma.Decimal(addon.total ??
                                addon.unitPrice * (addon.quantity ?? 1)),
                            metadata: addon.metadata,
                        })),
                    }
                    : undefined,
                approvedByAdminId: adminId,
            },
            include: {
                items: true,
                addOns: true,
            },
        });
        return updated;
    });
}
async function updateBookingStatus(bookingId, input, adminId) {
    const booking = await getBooking(bookingId);
    return prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.booking.update({
            where: { id: bookingId },
            data: {
                status: input.status,
                approvedByAdminId: adminId,
                timelineEvents: {
                    create: {
                        status: input.status,
                        notes: input.notes ?? `Status changed to ${input.status}`,
                    },
                },
            },
        });
        if (input.status === "COMPLETED" && !booking.completedAt) {
            await tx.booking.update({
                where: { id: bookingId },
                data: { completedAt: new Date() },
            });
        }
        if (input.status === "CANCELLED" && !booking.cancelledAt) {
            await tx.booking.update({
                where: { id: bookingId },
                data: { cancelledAt: new Date() },
            });
        }
        return updated;
    });
}
async function assignCleaner(bookingId, input) {
    await getBooking(bookingId);
    return prisma_1.default.cleanerAssignment.create({
        data: {
            bookingId,
            cleanerId: input.cleanerId,
            status: input.status,
            notes: input.notes,
        },
        include: {
            cleaner: true,
        },
    });
}
async function updateAssignment(assignmentId, input) {
    const data = {};
    if (input.cleanerId) {
        data.cleaner = { connect: { id: input.cleanerId } };
    }
    if (input.status) {
        data.status = input.status;
        if (input.status === "STARTED") {
            data.startedAt = new Date();
        }
        if (input.status === "COMPLETED") {
            data.completedAt = new Date();
        }
    }
    if (input.notes !== undefined)
        data.notes = input.notes;
    return prisma_1.default.cleanerAssignment.update({
        where: { id: assignmentId },
        data,
        include: {
            cleaner: true,
        },
    });
}
async function getBookingSummary(bookingId) {
    const booking = await getBooking(bookingId);
    const rewards = await prisma_1.default.rewardTransaction.aggregate({
        where: { bookingId },
        _sum: { points: true },
    });
    return {
        booking,
        rewardPoints: rewards._sum.points ?? 0,
    };
}
