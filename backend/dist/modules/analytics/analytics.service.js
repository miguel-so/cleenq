"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminOverview = getAdminOverview;
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getAdminOverview() {
    const [statusCounts, revenueAggregate, customerCount, cleanerCount, serviceCount, recentBookings, serviceBookings,] = await prisma_1.default.$transaction([
        prisma_1.default.booking.groupBy({
            by: ["status"],
            orderBy: {
                status: "asc",
            },
            _count: {
                status: true,
            },
        }),
        prisma_1.default.booking.aggregate({
            _sum: {
                total: true,
            },
        }),
        prisma_1.default.customer.count(),
        prisma_1.default.cleaner.count(),
        prisma_1.default.serviceCategory.count({
            where: { isActive: true },
        }),
        prisma_1.default.booking.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                serviceCategory: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        }),
        prisma_1.default.booking.groupBy({
            by: ["serviceCategoryId"],
            _count: {
                serviceCategoryId: true,
            },
            orderBy: {
                _count: {
                    serviceCategoryId: "desc",
                },
            },
            take: 5,
        }),
    ]);
    const statusMap = statusCounts.reduce((acc, item) => {
        const count = typeof item._count === "object" && item._count
            ? item._count.status ?? 0
            : 0;
        acc[item.status] = count;
        return acc;
    }, {});
    const serviceIds = serviceBookings
        .map((group) => group.serviceCategoryId)
        .filter((id) => Boolean(id));
    const services = await prisma_1.default.serviceCategory.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, name: true, slug: true },
    });
    const serviceMap = new Map(services.map((service) => [service.id, service]));
    const topServices = serviceBookings
        .map((group) => {
        const count = typeof group._count === "object" && group._count
            ? group._count.serviceCategoryId ?? 0
            : 0;
        return {
            service: serviceMap.get(group.serviceCategoryId ?? ""),
            totalBookings: count,
        };
    })
        .filter((item) => Boolean(item.service));
    return {
        metrics: {
            bookings: {
                total: statusCounts.reduce((sum, item) => {
                    const count = typeof item._count === "object" && item._count
                        ? item._count.status ?? 0
                        : 0;
                    return sum + count;
                }, 0),
                pending: statusMap.PENDING ?? 0,
                confirmed: statusMap.CONFIRMED ?? 0,
                scheduled: statusMap.SCHEDULED ?? 0,
                inProgress: statusMap.IN_PROGRESS ?? 0,
                completed: statusMap.COMPLETED ?? 0,
                cancelled: statusMap.CANCELLED ?? 0,
            },
            revenue: Number(revenueAggregate._sum.total ?? 0),
            customers: customerCount,
            cleaners: cleanerCount,
            activeServices: serviceCount,
        },
        recentBookings,
        topServices,
    };
}
